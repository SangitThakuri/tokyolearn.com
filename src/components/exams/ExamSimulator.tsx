"use client";

import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import {
  buildExamResult,
  examTimerSeconds,
  formatDuration,
} from "@/lib/exam-logic";
import { examHref } from "@/lib/site";
import { recordExamResult } from "@/lib/study-progress";
import type { JlptLevel } from "@/types/japanese";
import {
  EXAM_QUESTION_TYPE_LABELS,
  EXAM_SECTION_LABELS,
  type ExamListening,
  type ExamMode,
  type ExamPaper,
  type ExamPassage,
  type ExamQuestion,
  type ExamResult,
  type ExamSection,
} from "@/types/exam";

type Phase = "setup" | "playing" | "review";

const MODE_LABELS: Record<ExamMode, { ja: string; en: string }> = {
  exam: { ja: "本番モード", en: "Exam Mode" },
  practice: { ja: "練習モード", en: "Practice Mode" },
};

function ListeningControls({ listening }: { listening: ExamListening }) {
  const play = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(listening.transcript.ja);
    utterance.lang = listening.speechLang ?? "ja-JP";
    utterance.rate = listening.speechRate ?? 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/60">
      {listening.audioUrl ? (
        <audio controls src={listening.audioUrl} className="w-full" />
      ) : (
        <button
          type="button"
          onClick={play}
          className="self-start rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          ▶ {MODE_LABELS.practice.ja} / Play transcript (browser voice)
        </button>
      )}
      <details className="text-sm">
        <summary className="cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
          Transcript / スクリプト
        </summary>
        <p
          lang="ja"
          className="mt-2 leading-relaxed text-slate-800 dark:text-slate-200"
        >
          {listening.transcript.ja}
        </p>
        <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
          {listening.transcript.en}
        </p>
      </details>
    </div>
  );
}

function PassagePanel({ passage }: { passage: ExamPassage }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/70">
      <h3
        lang="ja"
        className="text-base font-bold text-slate-950 dark:text-white"
      >
        {passage.title.ja}
      </h3>
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
        {passage.title.en}
      </p>
      <p
        lang="ja"
        className="mt-3 text-base leading-8 text-slate-800 dark:text-slate-200"
      >
        {passage.text.ja}
      </p>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-semibold text-emerald-700 dark:text-emerald-400">
          English translation
        </summary>
        <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-400">
          {passage.text.en}
        </p>
      </details>
    </article>
  );
}

function QuestionPanel({
  question,
  number,
  total,
  answer,
  mode,
  showFeedback,
  flagged,
  passage,
  canAdvance,
  isLast,
  onAnswer,
  onFlag,
  onClear,
  onPrevious,
  onNext,
}: {
  question: ExamQuestion;
  number: number;
  total: number;
  answer: number | undefined;
  mode: ExamMode;
  showFeedback: boolean;
  flagged: boolean;
  passage: ExamPassage | undefined;
  canAdvance: boolean;
  isLast: boolean;
  onAnswer: (index: number) => void;
  onFlag: () => void;
  onClear: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const typeLabel = EXAM_QUESTION_TYPE_LABELS[question.type];
  const isAnswered = answer !== undefined;
  const feedback = showFeedback && isAnswered;

  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <legend className="px-1 text-sm font-bold text-emerald-700 dark:text-emerald-400">
        Q{number} / {total} · {typeLabel.ja} / {typeLabel.en}
      </legend>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {EXAM_SECTION_LABELS[question.section].ja} ·{" "}
          {EXAM_SECTION_LABELS[question.section].en}
        </span>
        <button
          type="button"
          onClick={onFlag}
          aria-pressed={flagged}
          className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
            flagged
              ? "border-amber-500 bg-amber-100 text-amber-900 dark:border-amber-400 dark:bg-amber-950/60 dark:text-amber-200"
              : "border-slate-300 text-slate-600 hover:border-amber-500 dark:border-slate-700 dark:text-slate-400"
          }`}
        >
          {flagged ? "★ Flagged for review" : "☆ Flag for review"}
        </button>
      </div>

      <p
        lang="ja"
        className="mt-4 text-lg leading-relaxed font-semibold text-slate-950 dark:text-white"
      >
        {question.prompt.ja}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {question.prompt.en}
      </p>

      {passage && (
        <div className="mt-4">
          <PassagePanel passage={passage} />
        </div>
      )}

      {question.listening && (
        <div className="mt-4">
          <ListeningControls listening={question.listening} />
        </div>
      )}

      {question.scrambled && (
        <p className="mt-3 text-sm font-semibold text-amber-700 dark:text-amber-400">
          ★ の位置に入る選択肢を選んでください。 / Choose the option for the ★ blank.
        </p>
      )}

      <div className="mt-4 grid gap-2">
        {question.choices.map((choice, index) => {
          const isCorrect = index === question.correctIndex;
          const isSelected = answer === index;
          const state = feedback
            ? isCorrect
              ? "correct"
              : isSelected
                ? "wrong"
                : "muted"
            : isSelected
              ? "selected"
              : "idle";
          const stateClass = {
            correct:
              "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/40",
            wrong:
              "border-rose-500 bg-rose-50 dark:border-rose-500 dark:bg-rose-950/40",
            muted: "border-slate-200 opacity-60 dark:border-slate-800",
            selected:
              "border-emerald-600 bg-emerald-50/60 dark:border-emerald-500 dark:bg-emerald-950/30",
            idle: "border-slate-200 hover:border-emerald-500 dark:border-slate-700 dark:hover:border-emerald-500",
          }[state];

          return (
            <label
              key={choice.label}
              htmlFor={`${question.id}-choice-${index}`}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${stateClass}`}
            >
              <input
                id={`${question.id}-choice-${index}`}
                type="radio"
                name={question.id}
                value={index}
                checked={isSelected}
                onChange={() => onAnswer(index)}
                disabled={mode === "practice" && isAnswered}
                className="mt-1 h-4 w-4 accent-emerald-700 dark:accent-emerald-400"
              />
              <span className="flex flex-col gap-0.5">
                <span
                  lang="ja"
                  className="text-base font-semibold text-slate-900 dark:text-slate-100"
                >
                  {choice.label}. {choice.text}
                </span>
                {choice.translation && (
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {choice.translation}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      {feedback && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="font-bold text-emerald-800 dark:text-emerald-300">
            Answer: {question.choices[question.correctIndex].label}.{" "}
            {question.choices[question.correctIndex].text}
          </p>
          <p
            lang="ja"
            className="mt-2 leading-relaxed text-slate-800 dark:text-slate-200"
          >
            {question.explanation.ja}
          </p>
          <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
            {question.explanation.en}
          </p>
          {question.scrambled && (
            <p
              lang="ja"
              className="mt-2 font-semibold text-slate-800 dark:text-slate-200"
            >
              完全文: {question.scrambled.completedSentence}
            </p>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {mode === "practice" && isAnswered && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:border-slate-500 dark:border-slate-600 dark:text-slate-300"
          >
            Clear answer
          </button>
        )}
        <div className="ml-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={number === 1}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-300"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canAdvance}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            {isLast
              ? mode === "exam"
                ? "Submit exam →"
                : "Finish & review →"
              : "Next →"}
          </button>
        </div>
      </div>
    </fieldset>
  );
}

function ReviewScreen({
  result,
  questions,
  answers,
  onRetryMissed,
  onRetake,
  onChangeMode,
}: {
  result: ExamResult;
  questions: readonly ExamQuestion[];
  answers: Readonly<Record<string, number>>;
  onRetryMissed: () => void;
  onRetake: () => void;
  onChangeMode: () => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-widest text-emerald-700 uppercase dark:text-emerald-400">
              Score report / 結果
            </p>
            <p className="mt-2 text-4xl font-black text-slate-950 dark:text-white">
              {result.correct}
              <span className="text-xl text-slate-500 dark:text-slate-400">
                {" "}
                / {result.total}
              </span>
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-400">
              {result.percent}% accuracy · {MODE_LABELS[result.mode].ja} /{" "}
              {MODE_LABELS[result.mode].en}
            </p>
          </div>
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-black ${
              result.passed
                ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200"
                : "bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200"
            }`}
          >
            <p lang="ja" className="text-lg">
              {result.passed ? "推定合格" : "推定不合格"}
            </p>
            <p>
              {result.passed ? "Pass line met" : "Below pass line"}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
            <span>Overall / 総合</span>
            <span>
              Pass line ≈ {result.totalPassPercent}% (JLPT{" "}
              {result.level} total)
            </span>
          </div>
          <div
            className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
            role="meter"
            aria-valuenow={result.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall accuracy"
          >
            <div
              className={`h-full rounded-full ${
                result.percent >= result.totalPassPercent
                  ? "bg-emerald-600"
                  : "bg-rose-500"
              }`}
              style={{ width: `${result.percent}%` }}
            />
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Estimate only: the real JLPT uses scaled scores and requires roughly{" "}
          {result.totalPassPercent}% overall plus {result.sectionPassPercent}%
          or more in every scoring section.
        </p>
        {result.scope === "drill" && (
          <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            Section and retry drills appear in recent activity only — best-score
            badges require a full paper run.
          </p>
        )}
      </section>

      <section aria-labelledby="section-accuracy-heading">
        <h2
          id="section-accuracy-heading"
          className="text-xl font-black text-slate-950 dark:text-white"
        >
          Section accuracy / 科目別正答率
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {result.sections.map((stat) => {
            const label = EXAM_SECTION_LABELS[stat.section];
            const meetsLine = stat.accuracy >= result.sectionPassPercent;
            return (
              <li
                key={stat.section}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-bold text-slate-950 dark:text-white">
                    <span lang="ja">{label.ja}</span> · {label.en}
                  </p>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                    {stat.correct}/{stat.total} · {stat.accuracy}% ·{" "}
                    <span
                      className={
                        meetsLine
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-rose-700 dark:text-rose-400"
                      }
                    >
                      {meetsLine ? "✓" : "✗"} {result.sectionPassPercent}% line
                    </span>
                  </p>
                </div>
                <div
                  className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
                  role="meter"
                  aria-valuenow={stat.accuracy}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${label.en} accuracy`}
                >
                  <div
                    className={`h-full rounded-full ${
                      meetsLine ? "bg-emerald-600" : "bg-rose-500"
                    }`}
                    style={{ width: `${stat.accuracy}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="review-questions-heading">
        <h2
          id="review-questions-heading"
          className="text-xl font-black text-slate-950 dark:text-white"
        >
          Answer review / 解答確認
        </h2>
        <ol className="mt-4 flex flex-col gap-3">
          {questions.map((question, index) => {
            const selected = answers[question.id];
            const correct = selected === question.correctIndex;
            const selectedText =
              selected === undefined
                ? "No answer / 無回答"
                : question.choices[selected].text;

            return (
              <li
                key={question.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <details>
                  <summary className="flex cursor-pointer flex-wrap items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        correct
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                      }`}
                    >
                      {correct ? "✓ Correct" : "✗ Review"}
                    </span>
                    Q{index + 1} · {selectedText} · Answer:{" "}
                    {question.choices[question.correctIndex].text}
                  </summary>
                  <div className="mt-3 text-sm">
                    <p
                      lang="ja"
                      className="font-semibold text-slate-900 dark:text-slate-100"
                    >
                      {question.prompt.ja}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {question.prompt.en}
                    </p>
                    <p
                      lang="ja"
                      className="mt-2 leading-relaxed text-slate-800 dark:text-slate-200"
                    >
                      {question.explanation.ja}
                    </p>
                    <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
                      {question.explanation.en}
                    </p>
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="flex flex-wrap gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
        <button
          type="button"
          onClick={onRetryMissed}
          disabled={result.missedQuestionIds.length === 0}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          Retry Missed Questions ({result.missedQuestionIds.length})
        </button>
        <button
          type="button"
          onClick={onRetake}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-slate-500 dark:border-slate-600 dark:text-slate-300"
        >
          Retake this set
        </button>
        <button
          type="button"
          onClick={onChangeMode}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-slate-500 dark:border-slate-600 dark:text-slate-300"
        >
          Switch mode
        </button>
      </div>
    </div>
  );
}

interface ExamState {
  paper: ExamPaper;
  phase: Phase;
  mode: ExamMode;
  /** Explicit mode choice in setup; null means follow the deep-link default. */
  modeChoice: ExamMode | null;
  /** Questions belonging to the current run (full paper or retry subset). */
  runQuestions: readonly ExamQuestion[];
  answers: Record<string, number>;
  flags: Record<string, boolean>;
  position: number;
  endsAt: number | null;
  remainingSeconds: number;
  result: ExamResult | null;
}

type ExamAction =
  | {
      type: "RESET";
      mode: ExamMode;
      questions: readonly ExamQuestion[];
      seconds: number;
    }
  | {
      type: "START";
      mode: ExamMode;
      questions: readonly ExamQuestion[];
      seconds: number;
      now: number;
    }
  | { type: "ANSWER"; questionId: string; choiceIndex: number }
  | { type: "CLEAR"; questionId: string }
  | { type: "FLAG"; questionId: string }
  | { type: "GOTO"; position: number }
  | { type: "TICK"; seconds: number }
  | { type: "FINISH"; now: number };

function createInitialState(paper: ExamPaper): ExamState {
  return {
    paper,
    phase: "setup",
    mode: "exam",
    modeChoice: null,
    runQuestions: paper.questions,
    answers: {},
    flags: {},
    position: 0,
    endsAt: null,
    remainingSeconds: examTimerSeconds(paper),
    result: null,
  };
}

/**
 * All answers, flags, and submission state live in one reducer so the timer
 * callback can finish the exact attempt that is currently on screen.
 */
function examReducer(state: ExamState, action: ExamAction): ExamState {
  const { paper } = state;

  switch (action.type) {
    case "RESET":
      return {
        ...createInitialState(paper),
        mode: action.mode,
        modeChoice: action.mode,
        runQuestions: action.questions,
        remainingSeconds: action.seconds,
      };
    case "START":
      return {
        ...state,
        phase: "playing",
        mode: action.mode,
        modeChoice: action.mode,
        runQuestions: action.questions,
        answers: {},
        flags: {},
        position: 0,
        result: null,
        endsAt: action.mode === "exam" ? action.now + action.seconds * 1000 : null,
        remainingSeconds: action.seconds,
      };
    case "ANSWER":
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: action.choiceIndex,
        },
      };
    case "CLEAR": {
      const answers = { ...state.answers };
      delete answers[action.questionId];
      return { ...state, answers };
    }
    case "FLAG":
      return {
        ...state,
        flags: {
          ...state.flags,
          [action.questionId]: !state.flags[action.questionId],
        },
      };
    case "GOTO":
      return {
        ...state,
        position: Math.min(
          Math.max(0, action.position),
          Math.max(0, state.runQuestions.length - 1),
        ),
      };
    case "TICK":
      if (state.phase !== "playing" || state.remainingSeconds === action.seconds) {
        return state;
      }
      return { ...state, remainingSeconds: action.seconds };
    case "FINISH":
      if (state.phase !== "playing") return state;
      return {
        ...state,
        phase: "review",
        result: buildExamResult(
          paper,
          state.runQuestions,
          state.answers,
          state.mode,
          action.now,
        ),
        endsAt: null,
      };
  }
}

function subscribeHash(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function readHash(): string {
  return typeof window === "undefined" ? "" : window.location.hash;
}

function readServerHash(): string {
  return "";
}

export function ExamSimulator({ paper }: { paper: ExamPaper }) {
  const [state, dispatch] = useReducer(
    examReducer,
    createInitialState(paper),
  );
  const hash = useSyncExternalStore(subscribeHash, readHash, readServerHash);
  const recordedResultRef = useRef<ExamResult | null>(null);

  // Deep links from the hub use #section=vocab|grammar|reading|listening.
  const deepLinkSection = useMemo(() => {
    const match = hash.match(/section=(vocab|grammar|reading|listening)/);
    const section = match?.[1] as ExamSection | undefined;
    if (!section) return null;
    return paper.questions.some((question) => question.section === section)
      ? section
      : null;
  }, [hash, paper]);

  const baseQuestions = useMemo(
    () =>
      deepLinkSection
        ? paper.questions.filter((question) => question.section === deepLinkSection)
        : paper.questions,
    [paper, deepLinkSection],
  );

  useEffect(() => {
    const result = state.result;
    if (!result || recordedResultRef.current === result) return;
    recordedResultRef.current = result;
    recordExamResult(result);
  }, [state.result]);

  useEffect(() => {
    if (
      state.phase !== "playing" ||
      state.mode !== "exam" ||
      state.endsAt === null
    ) {
      return;
    }

    const endsAt = state.endsAt;
    const tick = () => {
      const now = Date.now();
      const seconds = Math.max(0, Math.ceil((endsAt - now) / 1000));
      dispatch({ type: "TICK", seconds });
      if (seconds === 0) dispatch({ type: "FINISH", now });
    };

    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [state.phase, state.mode, state.endsAt]);

  const { phase, runQuestions, answers, flags, position, result } = state;
  // Section links from the hub open in practice mode unless the learner
  // explicitly picks another mode with the toggle above.
  const mode =
    phase === "setup" && deepLinkSection && state.modeChoice === null
      ? "practice"
      : (state.modeChoice ?? state.mode);

  const startWith = (
    nextQuestions: readonly ExamQuestion[],
    nextMode: ExamMode,
  ) => {
    if (nextQuestions.length === 0) return;
    dispatch({
      type: "START",
      mode: nextMode,
      questions: nextQuestions,
      seconds: examTimerSeconds(paper, nextQuestions),
      now: Date.now(),
    });
  };

  const resetToSetup = (nextMode: ExamMode = mode) => {
    dispatch({
      type: "RESET",
      mode: nextMode,
      questions: baseQuestions,
      seconds: examTimerSeconds(paper, baseQuestions),
    });
  };

  const displayQuestions = phase === "setup" ? baseQuestions : runQuestions;
  const current = phase === "playing" ? runQuestions[position] : undefined;
  const answeredCount = displayQuestions.filter(
    (question) => answers[question.id] !== undefined,
  ).length;
  const flaggedCount = displayQuestions.filter(
    (question) => flags[question.id],
  ).length;
  const plannedSeconds = examTimerSeconds(paper, displayQuestions);
  const showFeedback = mode === "practice";
  const canAdvance = mode === "exam" || answers[current?.id ?? ""] !== undefined;

  const retryMissed = () => {
    if (!result) return;
    const missed = runQuestions.filter((question) =>
      result.missedQuestionIds.includes(question.id),
    );
    startWith(missed, mode);
  };

  const levelLabel = paper.level as JlptLevel;
  const metaLabel = MODE_LABELS[mode];

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black tracking-widest text-emerald-700 uppercase dark:text-emerald-400">
              Simulator / 模擬試験
            </p>
            <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
              {metaLabel.ja} · {metaLabel.en}
            </p>
          </div>

          <div
            className="flex rounded-full border border-slate-300 p-1 dark:border-slate-700"
            role="group"
            aria-label="Choose exam mode"
          >
            {(Object.keys(MODE_LABELS) as ExamMode[]).map((candidate) => (
              <button
                key={candidate}
                type="button"
                disabled={phase === "playing"}
                onClick={() => resetToSetup(candidate)}
                aria-pressed={mode === candidate}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm ${
                  mode === candidate
                    ? "bg-emerald-700 text-white dark:bg-emerald-600"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <span lang="ja">{MODE_LABELS[candidate].ja}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <span
            aria-live={
              mode === "exam" && phase === "playing" ? "polite" : undefined
            }
          >
            {mode === "exam" ? "⏱ " : "⏱ Planned "}
            <strong
              className={
                mode === "exam" &&
                phase === "playing" &&
                state.remainingSeconds <= 300
                  ? "text-rose-700 dark:text-rose-400"
                  : "text-slate-950 dark:text-white"
              }
            >
              {formatDuration(
                mode === "exam" && phase === "playing"
                  ? state.remainingSeconds
                  : plannedSeconds,
              )}
            </strong>
          </span>
          <span>
            Answered {answeredCount} / {displayQuestions.length}
          </span>
          <span>Flagged {flaggedCount}</span>
          <span className="text-slate-500 dark:text-slate-400">
            JLPT {levelLabel} pacing
          </span>
        </div>
      </section>

      {phase === "setup" && (
        <section className="flex flex-col gap-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
          <div>
            <h2 className="text-xl font-black text-slate-950 dark:text-white">
              {mode === "exam"
                ? "本番モード / Exam Mode"
                : "練習モード / Practice Mode"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {mode === "exam"
                ? "A countdown runs for the full JLPT section allotment. Answers are hidden until you submit; use the grid to flag questions for review."
                : "No timer. Each answer is checked immediately with a Japanese and English explanation. Use Clear answer to try again."}
            </p>
          </div>

          {deepLinkSection && (
            <p className="rounded-xl bg-white/70 p-3 text-sm font-bold text-emerald-800 dark:bg-slate-950/40 dark:text-emerald-300">
              Section focus: {EXAM_SECTION_LABELS[deepLinkSection].ja} /{" "}
              {EXAM_SECTION_LABELS[deepLinkSection].en} ·{" "}
              {baseQuestions.length} questions
            </p>
          )}

          {mode === "exam" && (
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Timer: {formatDuration(plannedSeconds)} (official JLPT section
              times for {paper.level}; this paper is shorter than the real exam).
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => startWith(baseQuestions, mode)}
              className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {mode === "exam" ? "Start exam →" : "Start practice →"}
            </button>
            <Link
              href="/exams/"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-slate-500 dark:border-slate-600 dark:text-slate-300"
            >
              Back to exam bank
            </Link>
          </div>
        </section>
      )}

      {phase === "playing" && current && (
        <>
          <nav
            aria-label="Question navigation"
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-black text-slate-700 dark:text-slate-300">
                Question grid / 問題一覧
              </h2>
              <ul className="flex flex-wrap gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" />
                  Answered
                </li>
                <li className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded border border-amber-500" />★ Flagged
                </li>
                <li className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded border border-slate-300 dark:border-slate-600" />
                  Unanswered
                </li>
              </ul>
            </div>
            <ol className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-8">
              {runQuestions.map((question, index) => {
                const isAnswered = answers[question.id] !== undefined;
                const isFlagged = Boolean(flags[question.id]);
                const isCurrent = index === position;
                return (
                  <li key={question.id}>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "GOTO", position: index })}
                      aria-current={isCurrent ? "step" : undefined}
                      aria-label={`Question ${index + 1}, ${
                        isAnswered ? "answered" : "unanswered"
                      }${isFlagged ? ", flagged for review" : ""}`}
                      className={`flex h-10 w-full items-center justify-center rounded-lg border text-sm font-bold transition-colors ${
                        isCurrent
                          ? "border-emerald-700 bg-emerald-700 text-white ring-2 ring-emerald-300 dark:border-emerald-500 dark:bg-emerald-600 dark:ring-emerald-800"
                          : isFlagged
                            ? "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
                            : isAnswered
                              ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "border-slate-300 text-slate-600 hover:border-emerald-500 dark:border-slate-700 dark:text-slate-400"
                      }`}
                    >
                      {index + 1}
                      {isFlagged && <span aria-hidden="true">★</span>}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <QuestionPanel
            question={current}
            number={position + 1}
            total={runQuestions.length}
            answer={answers[current.id]}
            mode={mode}
            showFeedback={showFeedback}
            flagged={Boolean(flags[current.id])}
            passage={
              current.passageId
                ? paper.passages.find(
                    (passage) => passage.id === current.passageId,
                  )
                : undefined
            }
            canAdvance={canAdvance}
            isLast={position === runQuestions.length - 1}
            onAnswer={(index) =>
              dispatch({
                type: "ANSWER",
                questionId: current.id,
                choiceIndex: index,
              })
            }
            onFlag={() =>
              dispatch({ type: "FLAG", questionId: current.id })
            }
            onClear={() =>
              dispatch({ type: "CLEAR", questionId: current.id })
            }
            onPrevious={() =>
              dispatch({ type: "GOTO", position: position - 1 })
            }
            onNext={() => {
              if (position + 1 < runQuestions.length) {
                dispatch({ type: "GOTO", position: position + 1 });
                return;
              }
              dispatch({ type: "FINISH", now: Date.now() });
            }}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {mode === "exam"
                ? "Score is hidden until submission. Unanswered questions count as incorrect."
                : "Answers and explanations appear as soon as you choose an option."}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => resetToSetup(mode)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-slate-500 dark:border-slate-600 dark:text-slate-300"
              >
                Reset
              </button>
              {mode === "exam" && (
                <button
                  type="button"
                  onClick={() => dispatch({ type: "FINISH", now: Date.now() })}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Submit exam
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {phase === "review" && result && (
        <ReviewScreen
          result={result}
          questions={runQuestions}
          answers={answers}
          onRetryMissed={retryMissed}
          onRetake={() => startWith(baseQuestions, mode)}
          onChangeMode={() => resetToSetup(mode === "exam" ? "practice" : "exam")}
        />
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Best score and completion are stored locally at{" "}
        <code>tokyolearn:progress:v1</code>. No account, no server.
      </p>

      <Link
        href={examHref(paper.id)}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      >
        Reload this paper
      </Link>
    </div>
  );
}
