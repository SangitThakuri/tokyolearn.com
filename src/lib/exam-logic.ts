/**
 * Pure helpers shared by the exam hub and simulator: JLPT pacing, pass-mark
 * estimates, timer formatting, and result calculation. No browser or server
 * APIs live here, so it is safe to import from Client Components.
 */
import {
  EXAM_SECTIONS,
  type ExamMode,
  type ExamPaper,
  type ExamQuestion,
  type ExamResult,
  type ExamResultScope,
  type ExamSection,
  type ExamSectionStat,
} from "@/types/exam";
import type { JlptLevel } from "@/types/japanese";

/**
 * Official 2026 JLPT section times (minutes). N1/N2 combine vocabulary,
 * grammar and reading in one 110/105-minute block; those totals are split
 * across our three sections so the sum still matches the official block.
 */
export const JLPT_SECTION_MINUTES: Record<
  JlptLevel,
  Record<ExamSection, number>
> = {
  N5: { vocab: 20, grammar: 15, reading: 25, listening: 30 },
  N4: { vocab: 25, grammar: 20, reading: 35, listening: 35 },
  N3: { vocab: 30, grammar: 30, reading: 40, listening: 40 },
  N2: { vocab: 25, grammar: 35, reading: 45, listening: 50 },
  N1: { vocab: 25, grammar: 35, reading: 50, listening: 55 },
};

export interface ExamPassMarks {
  /** Raw total pass mark out of 180. */
  totalMark: number;
  /** Raw sectional pass mark. */
  sectionMark: number;
  /** Range of the sectional mark (60 for N1–N3, 120 for N4/N5). */
  sectionRange: number;
  /** Percent equivalents used for our accuracy-based estimate. */
  totalPercent: number;
  sectionPercent: number;
}

/** Source: JLPT "Scoring Sections, Pass or Fail, Score Report". */
export const JLPT_PASS_MARKS: Record<JlptLevel, ExamPassMarks> = {
  N1: {
    totalMark: 100,
    sectionMark: 19,
    sectionRange: 60,
    totalPercent: Math.round((100 / 180) * 100),
    sectionPercent: Math.round((19 / 60) * 100),
  },
  N2: {
    totalMark: 90,
    sectionMark: 19,
    sectionRange: 60,
    totalPercent: Math.round((90 / 180) * 100),
    sectionPercent: Math.round((19 / 60) * 100),
  },
  N3: {
    totalMark: 95,
    sectionMark: 19,
    sectionRange: 60,
    totalPercent: Math.round((95 / 180) * 100),
    sectionPercent: Math.round((19 / 60) * 100),
  },
  N4: {
    totalMark: 90,
    sectionMark: 38,
    sectionRange: 120,
    totalPercent: Math.round((90 / 180) * 100),
    sectionPercent: Math.round((38 / 120) * 100),
  },
  N5: {
    totalMark: 80,
    sectionMark: 38,
    sectionRange: 120,
    totalPercent: Math.round((80 / 180) * 100),
    sectionPercent: Math.round((38 / 120) * 100),
  },
};

export function examPassMarks(level: JlptLevel): ExamPassMarks {
  return JLPT_PASS_MARKS[level];
}

/**
 * Countdown budget for an attempt. Full papers receive the official JLPT
 * section allotments; retries and section drills are scaled within each
 * section so the pacing per question stays the same.
 */
export function examTimerSeconds(
  paper: ExamPaper,
  questions: readonly ExamQuestion[] = paper.questions,
): number {
  let seconds = 0;

  for (const section of EXAM_SECTIONS) {
    const paperCount = paper.questions.filter(
      (question) => question.section === section,
    ).length;
    const attemptCount = questions.filter(
      (question) => question.section === section,
    ).length;
    if (paperCount === 0 || attemptCount === 0) continue;

    const minutes = JLPT_SECTION_MINUTES[paper.level][section];
    seconds += Math.ceil((minutes * 60 * attemptCount) / paperCount);
  }

  return seconds;
}

export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (value: number) => String(value).padStart(2, "0");

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}

function sectionStats(
  questions: readonly ExamQuestion[],
  answers: Readonly<Record<string, number>>,
): ExamSectionStat[] {
  return EXAM_SECTIONS.flatMap((section) => {
    const sectionQuestions = questions.filter(
      (question) => question.section === section,
    );
    if (sectionQuestions.length === 0) return [];

    const correct = sectionQuestions.filter(
      (question) => answers[question.id] === question.correctIndex,
    ).length;
    return [{
      section,
      correct,
      total: sectionQuestions.length,
      accuracy: Math.round((correct / sectionQuestions.length) * 100),
    }];
  });
}

/** Drills (section focus and retry-missed) never overwrite a full-paper best. */
export function examRunScope(
  paper: ExamPaper,
  questions: readonly ExamQuestion[],
): ExamResultScope {
  if (questions.length !== paper.questions.length) return "drill";
  return questions.every(
    (question, index) => question.id === paper.questions[index].id,
  )
    ? "full"
    : "drill";
}

/** Build the persisted result shown in the review screen and on the hub. */
export function buildExamResult(
  paper: ExamPaper,
  questions: readonly ExamQuestion[],
  answers: Readonly<Record<string, number>>,
  mode: ExamMode,
  date: number = Date.now(),
): ExamResult {
  const marks = examPassMarks(paper.level);
  const correct = questions.filter(
    (question) => answers[question.id] === question.correctIndex,
  ).length;
  const total = questions.length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  const sections = sectionStats(questions, answers);
  const passed =
    total > 0 &&
    percent >= marks.totalPercent &&
    sections.every((section) => section.accuracy >= marks.sectionPercent);

  return {
    paperId: paper.id,
    level: paper.level,
    scope: examRunScope(paper, questions),
    mode,
    correct,
    total,
    percent,
    passed,
    totalPassPercent: marks.totalPercent,
    sectionPassPercent: marks.sectionPercent,
    sections,
    missedQuestionIds: questions
      .filter((question) => answers[question.id] !== question.correctIndex)
      .map((question) => question.id),
    date,
  };
}
