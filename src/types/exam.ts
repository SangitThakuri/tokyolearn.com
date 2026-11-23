/** Types for the static past-paper-style exam bank in /data/exams. */
import type { JlptLevel } from "./japanese";

/** The four sections used by the official JLPT. */
export type ExamSection = "vocab" | "grammar" | "reading" | "listening";

/** Question styles within those sections. */
export type ExamQuestionType =
  | "kanji-reading"
  | "orthography"
  | "contextual-expression"
  | "paraphrase"
  | "usage"
  | "sentence-grammar"
  | "scrambled-sentence"
  | "text-grammar"
  | "short-reading"
  | "mid-length-reading"
  | "listening-comprehension";

/** Every learner-facing string in an exam paper is bilingual. */
export interface ExamLocalizedText {
  ja: string;
  en: string;
}

export interface ExamChoice {
  /** Stable display label, normally "1" through "4". */
  label: string;
  /** Japanese answer text. */
  text: string;
  /** Optional English gloss for beginner-friendly papers. */
  translation?: string;
}

/**
 * Listening items may ship an audio file. When `audioUrl` is absent the UI
 * reads `transcript.ja` with the Web Speech API instead, so no binary assets
 * are required in the static export.
 */
export interface ExamListening {
  audioUrl?: string;
  transcript: ExamLocalizedText;
  /** BCP 47 tag passed to speech synthesis. Defaults to ja-JP. */
  speechLang?: string;
  /** Speech rate passed to speech synthesis. Defaults to 0.9. */
  speechRate?: number;
}

/** Extra data for the four-blank ＿ ＿ ★ ＿ ordering task. */
export interface ExamScrambledSentence {
  /** Zero-based choice indices in the correct reading order. */
  correctOrder: [number, number, number, number];
  /** Which of the four blanks contains ★ (zero-based). */
  starSlotIndex: 0 | 1 | 2 | 3;
  /** Fully assembled sentence shown in the explanation. */
  completedSentence: string;
}

export interface ExamPassage {
  /** Unique within the paper; referenced by reading questions. */
  id: string;
  title: ExamLocalizedText;
  text: ExamLocalizedText;
}

export interface ExamQuestion {
  /** Unique within the paper, e.g. "n5-sample-01-q01". */
  id: string;
  section: ExamSection;
  type: ExamQuestionType;
  /** For scrambled items this contains the ＿ ＿ ★ ＿ blanks. */
  prompt: ExamLocalizedText;
  /** Exactly four choices; `correctIndex` points into this array. */
  choices: ExamChoice[];
  /** Zero-based index of the correct choice. */
  correctIndex: number;
  /** Bilingual rationale for the correct answer. */
  explanation: ExamLocalizedText;
  /** Reading questions link to a passage in `ExamPaper.passages`. */
  passageId?: string;
  /** Present on listening questions. */
  listening?: ExamListening;
  /** Present on scrambled-sentence questions. */
  scrambled?: ExamScrambledSentence;
}

/** One JSON file in /data/exams. */
export interface ExamPaper {
  /** Must match the JSON filename without `.json`. */
  id: string;
  level: JlptLevel;
  session: string;
  title: ExamLocalizedText;
  description: ExamLocalizedText;
  passages: ExamPassage[];
  questions: ExamQuestion[];
}

export type ExamDataset = ExamPaper[];

export const EXAM_SECTIONS: readonly ExamSection[] = [
  "vocab",
  "grammar",
  "reading",
  "listening",
];

export const EXAM_SECTION_LABELS: Record<ExamSection, ExamLocalizedText> = {
  vocab: { ja: "文字・語彙", en: "Vocabulary" },
  grammar: { ja: "文法", en: "Grammar" },
  reading: { ja: "読解", en: "Reading" },
  listening: { ja: "聴解", en: "Listening" },
};

export const EXAM_QUESTION_TYPE_LABELS: Record<
  ExamQuestionType,
  ExamLocalizedText
> = {
  "kanji-reading": { ja: "漢字読み", en: "Kanji reading" },
  orthography: { ja: "表記", en: "Orthography" },
  "contextual-expression": { ja: "文脈規定", en: "Contextual expression" },
  paraphrase: { ja: "言い換え類義", en: "Paraphrase" },
  usage: { ja: "用法", en: "Usage" },
  "sentence-grammar": { ja: "文型", en: "Sentence grammar" },
  "scrambled-sentence": { ja: "並べ替え", en: "Scrambled sentence" },
  "text-grammar": { ja: "文章の文法", en: "Text grammar" },
  "short-reading": { ja: "短文の理解", en: "Short passage" },
  "mid-length-reading": { ja: "中文の理解", en: "Mid-length passage" },
  "listening-comprehension": {
    ja: "聴解",
    en: "Listening comprehension",
  },
};

/** How the paper is being taken. */
export type ExamMode = "exam" | "practice";

/** The four chips offered on the exam hub (listening stays inside full mocks). */
export type ExamSectionFilter = "all" | "vocab" | "grammar" | "reading";

export const EXAM_SECTION_FILTERS: readonly {
  value: ExamSectionFilter;
  label: ExamLocalizedText;
}[] = [
  { value: "all", label: { ja: "全科目", en: "Full Mock" } },
  { value: "vocab", label: EXAM_SECTION_LABELS.vocab },
  { value: "grammar", label: EXAM_SECTION_LABELS.grammar },
  { value: "reading", label: EXAM_SECTION_LABELS.reading },
];

export interface ExamSectionStat {
  section: ExamSection;
  correct: number;
  total: number;
  /** Percentage 0–100. */
  accuracy: number;
}

/** Full paper attempts count toward best scores; drills do not. */
export type ExamResultScope = "full" | "drill";

/** One completed attempt, persisted in localStorage through study-progress. */
export interface ExamResult {
  paperId: string;
  level: JlptLevel;
  scope: ExamResultScope;
  mode: ExamMode;
  correct: number;
  total: number;
  /** Percentage 0–100, rounded to the nearest integer. */
  percent: number;
  /** Accuracy-based estimate against official JLPT pass marks. */
  passed: boolean;
  totalPassPercent: number;
  sectionPassPercent: number;
  sections: ExamSectionStat[];
  missedQuestionIds: string[];
  date: number;
}

/** Used by both the UI and the dataset validator. */
export const EXAM_SECTION_FOR_TYPE: Record<ExamQuestionType, ExamSection> = {
  "kanji-reading": "vocab",
  orthography: "vocab",
  "contextual-expression": "vocab",
  paraphrase: "vocab",
  usage: "vocab",
  "sentence-grammar": "grammar",
  "scrambled-sentence": "grammar",
  "text-grammar": "grammar",
  "short-reading": "reading",
  "mid-length-reading": "reading",
  "listening-comprehension": "listening",
};
