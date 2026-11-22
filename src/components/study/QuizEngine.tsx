"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { LevelPicker, ProgressBar } from "@/components/study/StudyControls";
import { kanjiHref, practiceHref } from "@/lib/site";
import { buildQuiz, loadKanji, type QuizQuestion } from "@/lib/study-data";
import {
  getProgressSnapshot,
  getServerProgressSnapshot,
  quizResultKey,
  recordQuizResult,
  subscribeProgress,
} from "@/lib/study-progress";
import { setPracticeParams, usePracticeParams } from "@/lib/url-params";
import type { KanjiEntry } from "@/types/japanese";
import type { QuestionCount, QuizType } from "@/types/study";

type Phase = "setup" | "playing" | "review";

const QUIZ_TYPES: { value: QuizType; label: string; hint: string }[] = [
  {
    value: "kanjiToReading",
    label: "Kanji → Reading",
    hint: "Choose the reading of the kanji you see.",
  },
  {
    value: "readingToKanji",
    label: "Reading → Kanji",
    hint: "Choose the kanji that matches the reading.",
  },
  {
    value: "meaningToKanji",
    label: "Meaning → Kanji",
    hint: "Choose the kanji that matches the English meaning.",
  },
];

const COUNTS: QuestionCount[] = [10, 20, 50];

export function QuizEngine() {
  const { level, type, count } = usePracticeParams();
  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getServerProgressSnapshot,
  );

  const [loadedLevel, setLoadedLevel] = useState("");
  const [pool, setPool] = useState<KanjiEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [position, setPosition] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [phase, setPhase] = useState<Phase>("setup");
  const [activeConfig, setActiveConfig] = useState("");

  // A new level means a new pool and a clean quiz.
  if (level !== loadedLevel) {
    setLoadedLevel(level);
    setPool([]);
    setLoading(true);
    setLoadError("");
    setQuestions([]);
    setAnswers([]);
    setPosition(0);
    setStreak(0);
    setBestStreak(0);
    setPhase("setup");
    setActiveConfig("");
  }

  useEffect(() => {
    let active = true;
    loadKanji(level)
      .then((items) => {
        if (!active) return;
        setPool(items);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoadError("This level could not be loaded. Please try again.");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [level]);

  const config = `${level}:${type}:${count}`;
  const settingsChanged = phase !== "setup" && activeConfig !== config;
  const current = phase === "playing" ? questions[position] : undefined;
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const correctCount = useMemo(
    () =>
      questions.reduce(
        (total, question, index) =>
          total + (answers[index] === question.answer ? 1 : 0),
        0,
      ),
    [questions, answers],
  );
  const missed = useMemo(
    () =>
      questions
        .map((question, index) => ({ question, given: answers[index] }))
        .filter(({ question, given }) => given !== question.answer),
    [questions, answers],
  );
  const bestScore =
    progress.quizBest[quizResultKey(level, type, count)] ?? 0;

  const start = useCallback(() => {
    const generated = buildQuiz(pool, type, count);
    if (generated.length === 0) return;
    setQuestions(generated);
    setAnswers(Array(generated.length).fill(null));
    setPosition(0);
    setStreak(0);
    setBestStreak(0);
    setActiveConfig(config);
    setPhase("playing");
  }, [pool, type, count, config]);

  const answer = useCallback(
    (option: string) => {
      if (phase !== "playing" || !current || answers[position] !== null) return;
      const nextAnswers = [...answers];
      nextAnswers[position] = option;
      setAnswers(nextAnswers);

      const nextStreak = option === current.answer ? streak + 1 : 0;
      setStreak(nextStreak);
      setBestStreak((previous) => Math.max(previous, nextStreak));
    },
    [phase, current, answers, position, streak],
  );

  const advance = useCallback(() => {
    if (phase !== "playing" || answers[position] === null) return;
    if (position + 1 < questions.length) {
      setPosition(position + 1);
      return;
    }
    setPhase("review");
    recordQuizResult({
      level,
      type,
      count,
      correct: correctCount,
      bestStreak,
      date: Date.now(),
    });
  }, [phase, answers, position, questions.length, level, type, count, correctCount, bestStreak]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (phase === "playing" && current) {
        const choice = Number(event.key);
        if (Number.isInteger(choice) && choice >= 1 && choice <= current.options.length) {
          event.preventDefault();
          answer(current.options[choice - 1]);
        } else if (
          (event.key === "Enter" || event.code === "Space") &&
          answers[position] !== null
        ) {
          event.preventDefault();
          advance();
        }
      } else if (phase === "review" && (event.key === "Enter" || event.code === "Space")) {
        event.preventDefault();
        start();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, current, answers, position, answer, advance, start]);

  return (
    <div className="flex flex-col gap-8">
      <section
        aria-label="Quiz settings"
        className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div>
          <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
            JLPT level
          </h2>
          <div className="mt-3">
            <LevelPicker level={level} />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
            Question style
          </h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {QUIZ_TYPES.map((item) => {
              const active = type === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPracticeParams({ type: item.value })}
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    active
                      ? "border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/40"
                      : "border-slate-300 hover:border-emerald-600 dark:border-slate-700"
                  }`}
                >
                  <span className="block text-sm font-bold text-slate-950 dark:text-white">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs text-slate-600 dark:text-slate-400">
                    {item.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
              Questions
            </h2>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Question count">
              {COUNTS.map((value) => {
                const active = count === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setPracticeParams({ count: value })}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                      active
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                        : "border border-slate-300 text-slate-700 hover:border-emerald-600 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Best: {bestScore}/{count}
            </span>
            <button
              type="button"
              onClick={start}
              disabled={loading || pool.length === 0 || Boolean(loadError)}
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-800 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {phase === "setup" ? "Start quiz" : "Restart with these settings"}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
          {loading
            ? `Loading ${level} kanji…`
            : loadError
              ? loadError
              : `${pool.length} kanji available · wrong answers come from the same level`}
        </p>

        {settingsChanged && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            Settings changed. Start a new quiz to apply them.
          </p>
        )}
      </section>

      {phase === "setup" ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            Ready when you are.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Pick a level, style, and length above, then start the quiz. Your best
            score is saved in this browser — no account needed.
          </p>
          <Link
            href={practiceHref("flashcards", level)}
            className="mt-4 inline-block text-sm font-bold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
          >
            Study {level} flashcards instead →
          </Link>
        </div>
      ) : phase === "playing" && current ? (
        <section aria-label="Quiz question" className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Question {position + 1} of {questions.length}
            </span>
            <span className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600 dark:text-slate-400">
              <span>Score: {correctCount}</span>
              <span>Streak: {streak}</span>
              <span>Best: {bestStreak}</span>
            </span>
          </div>
          <ProgressBar
            percent={Math.round((answeredCount / questions.length) * 100)}
            label="Quiz completion"
          />

          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
              {QUIZ_TYPES.find((item) => item.value === type)?.label}
            </p>
            <p
              lang={current.promptLang}
              className={`mt-4 font-black text-slate-950 dark:text-white ${
                current.promptLang === "ja"
                  ? "text-6xl sm:text-7xl"
                  : "text-2xl sm:text-3xl"
              }`}
            >
              {current.prompt}
            </p>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Choose the correct answer below
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {current.options.map((option, optionIndex) => {
              const chosen = answers[position] === option;
              const isCorrect = option === current.answer;
              const revealed = chosen || answers[position] !== null;
              let stateClass =
                "border-slate-300 text-slate-800 hover:border-emerald-600 dark:border-slate-700 dark:text-slate-200";
              if (revealed && isCorrect) {
                stateClass =
                  "border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200";
              } else if (revealed && chosen) {
                stateClass =
                  "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/50 dark:text-rose-200";
              }
              return (
                <button
                  key={`${option}-${optionIndex}`}
                  type="button"
                  onClick={() => answer(option)}
                  disabled={answers[position] !== null}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-base font-bold transition-colors disabled:cursor-default ${stateClass}`}
                >
                  <kbd className="rounded bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    {optionIndex + 1}
                  </kbd>
                  <span lang={current.promptLang === "ja" ? "ja" : undefined}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setPhase("setup")}
              className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Quit quiz
            </button>
            <button
              type="button"
              onClick={advance}
              disabled={answers[position] === null}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50 dark:bg-white dark:text-slate-950"
            >
              {position + 1 === questions.length ? "Finish quiz" : "Next question"}
            </button>
          </div>
        </section>
      ) : (
        <section aria-label="Quiz results" className="flex flex-col gap-6">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8 dark:border-emerald-900 dark:bg-emerald-950/30">
            <p className="text-sm font-bold tracking-widest text-emerald-800 uppercase dark:text-emerald-400">
              Quiz complete
            </p>
            <p className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl dark:text-white">
              {correctCount} / {questions.length}
            </p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              {questions.length > 0
                ? Math.round((correctCount / questions.length) * 100)
                : 0}
              % correct · best streak {bestStreak} · best score {bestScore}/
              {count}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={start}
                className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={() => setPhase("setup")}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-800 dark:border-slate-700 dark:text-slate-200"
              >
                Change settings
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              Review missed items ({missed.length})
            </h2>
            {missed.length === 0 ? (
              <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                Perfect score — nothing to review. Nice work!
              </p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {missed.map(({ question, given }) => (
                  <li
                    key={question.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <p className="text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                      {QUIZ_TYPES.find((item) => item.value === question.type)?.label}
                    </p>
                    <p
                      lang={question.promptLang}
                      className="mt-2 text-2xl font-black text-slate-950 dark:text-white"
                    >
                      {question.prompt}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      Your answer:{" "}
                      <span lang="ja" className="font-bold text-rose-700 dark:text-rose-400">
                        {given ?? "—"}
                      </span>
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Correct:{" "}
                      <span lang="ja" className="font-bold text-emerald-700 dark:text-emerald-400">
                        {question.answer}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {question.meaning} · <span lang="ja">{question.reading}</span>
                    </p>
                    <Link
                      href={kanjiHref(question.kanji)}
                      className="mt-2 inline-block text-xs font-bold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
                    >
                      View kanji details →
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
