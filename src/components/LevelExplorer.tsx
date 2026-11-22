"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { JlptLevel } from "@/types/japanese";
import { kanjiHref } from "@/lib/site";

interface KanjiGridItem {
  character: string;
  strokes: number;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
}

interface VocabGridItem {
  word: string;
  reading: string;
  meaning: string;
  partOfSpeech: string;
}

interface LevelExplorerProps {
  level: JlptLevel;
  label: string;
  kanji: KanjiGridItem[];
  vocab: VocabGridItem[];
}

type Tab = "kanji" | "vocab";
type StrokeFilter = "all" | "1-5" | "6-10" | "11+";
type PosFilter = "all" | "noun" | "verb" | "adjective" | "other";
type Tool = "none" | "flashcards" | "quiz";

const PAGE_SIZE = 48;

function matchesStrokeFilter(strokes: number, filter: StrokeFilter): boolean {
  if (filter === "1-5") return strokes <= 5;
  if (filter === "6-10") return strokes >= 6 && strokes <= 10;
  if (filter === "11+") return strokes >= 11;
  return true;
}

function posGroup(partOfSpeech: string): Exclude<PosFilter, "all"> {
  const value = partOfSpeech.toLowerCase();
  if (value.includes("noun")) return "noun";
  if (value.includes("verb")) return "verb";
  if (value.includes("adjective")) return "adjective";
  return "other";
}

const strokeFilters: { value: StrokeFilter; label: string }[] = [
  { value: "all", label: "All strokes" },
  { value: "1-5", label: "1–5" },
  { value: "6-10", label: "6–10" },
  { value: "11+", label: "11+" },
];

const posFilters: { value: PosFilter; label: string }[] = [
  { value: "all", label: "All words" },
  { value: "noun", label: "Nouns" },
  { value: "verb", label: "Verbs" },
  { value: "adjective", label: "Adjectives" },
  { value: "other", label: "Other" },
];

function subscribeToHash(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function readHash(): string {
  return typeof window === "undefined" ? "" : window.location.hash.slice(1);
}

export function LevelExplorer({
  level,
  label,
  kanji,
  vocab,
}: LevelExplorerProps) {
  const [tab, setTab] = useState<Tab>("kanji");
  const [query, setQuery] = useState("");
  const [strokeFilter, setStrokeFilter] = useState<StrokeFilter>("all");
  const [posFilter, setPosFilter] = useState<PosFilter>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  const normalizedQuery = query.trim().toLocaleLowerCase();

  // Reset pagination and drill state whenever the active filters change.
  // React's documented "adjust state while rendering" pattern avoids an
  // extra effect-driven render.
  const filterKey = `${tab}|${normalizedQuery}|${strokeFilter}|${posFilter}`;
  const [previousFilterKey, setPreviousFilterKey] = useState(filterKey);
  if (filterKey !== previousFilterKey) {
    setPreviousFilterKey(filterKey);
    setVisibleCount(PAGE_SIZE);
    setCardIndex(0);
    setQuizIndex(0);
    setQuizAnswer(null);
    setRevealed(false);
  }

  // Deep links such as /jlpt/n5#flashcards open the matching tool on load.
  const hash = useSyncExternalStore(subscribeToHash, readHash, () => "");
  const [manualTool, setManualTool] = useState<Tool>("none");
  const hashTool: Tool =
    hash === "flashcards" || hash === "quiz" ? hash : "none";
  const activeTool: Tool = manualTool === "none" ? hashTool : manualTool;

  const filteredKanji = useMemo(
    () =>
      kanji.filter((item) => {
        if (!matchesStrokeFilter(item.strokes, strokeFilter)) return false;
        if (!normalizedQuery) return true;
        const haystack = [
          item.character,
          ...item.meanings,
          ...item.onyomi,
          ...item.kunyomi,
        ]
          .join(" ")
          .toLocaleLowerCase();
        return haystack.includes(normalizedQuery);
      }),
    [kanji, normalizedQuery, strokeFilter],
  );

  const filteredVocab = useMemo(
    () =>
      vocab.filter((item) => {
        if (posFilter !== "all" && posGroup(item.partOfSpeech) !== posFilter) {
          return false;
        }
        if (!normalizedQuery) return true;
        return [
          item.word,
          item.reading,
          item.meaning,
          item.partOfSpeech,
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      }),
    [vocab, normalizedQuery, posFilter],
  );

  // Scroll into view when a tool opens, including from a hash deep link.
  useEffect(() => {
    if (activeTool === "none") return;
    requestAnimationFrame(() => {
      document.getElementById(activeTool)?.scrollIntoView({ block: "start" });
    });
  }, [activeTool]);

  const currentCard =
    filteredVocab.length > 0
      ? filteredVocab[cardIndex % filteredVocab.length]
      : undefined;
  const currentQuestion =
    filteredVocab.length > 0
      ? filteredVocab[quizIndex % filteredVocab.length]
      : undefined;

  const quizOptions = useMemo(() => {
    if (!currentQuestion || filteredVocab.length === 0) return [];
    const others: string[] = [];
    for (let offset = 1; offset < filteredVocab.length && others.length < 3; offset++) {
      const candidate =
        filteredVocab[(quizIndex + offset) % filteredVocab.length].meaning;
      if (candidate && candidate !== currentQuestion.meaning && !others.includes(candidate)) {
        others.push(candidate);
      }
    }
    const options = others.slice(0, 3);
    const correctPosition = quizIndex % (options.length + 1);
    options.splice(correctPosition, 0, currentQuestion.meaning);
    return options;
  }, [currentQuestion, filteredVocab, quizIndex]);

  function openTool(tool: Exclude<Tool, "none">) {
    setManualTool(tool);
  }

  function closeTool() {
    setManualTool("none");
    if (typeof window !== "undefined" && window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }

  function nextCard() {
    setCardIndex((index) => index + 1);
    setRevealed(false);
  }

  function previousCard() {
    setCardIndex((index) => Math.max(0, index - 1));
    setRevealed(false);
  }

  function answerQuiz(optionIndex: number) {
    if (quizAnswer !== null || !currentQuestion) return;
    setQuizAnswer(optionIndex);
    if (quizOptions[optionIndex] === currentQuestion.meaning) {
      setQuizScore((score) => score + 1);
    }
  }

  function nextQuestion() {
    setQuizIndex((index) => index + 1);
    setQuizAnswer(null);
  }

  const visibleKanji = filteredKanji.slice(0, visibleCount);
  const visibleVocab = filteredVocab.slice(0, visibleCount);
  const resultCount = tab === "kanji" ? filteredKanji.length : filteredVocab.length;

  return (
    <section id="explorer" aria-labelledby="explorer-heading" className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 id="explorer-heading" className="text-xl font-bold text-slate-950 dark:text-white">
            Explore {label}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Search the grids, then drill what you find.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => openTool("flashcards")}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Start Flashcards
          </button>
          <button
            type="button"
            onClick={() => openTool("quiz")}
            className="rounded-xl border border-emerald-700 px-4 py-2.5 text-sm font-bold text-emerald-800 transition-colors hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
          >
            Take Quiz
          </button>
        </div>
      </div>

      {activeTool !== "none" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div
            id="flashcards"
            className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">Flashcards</h3>
              <button
                type="button"
                onClick={closeTool}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            {currentCard ? (
              <div className="mt-4 flex min-h-44 flex-col items-center justify-center rounded-xl bg-slate-50 p-6 text-center dark:bg-slate-950">
                <p lang="ja" className="text-4xl font-black text-slate-950 dark:text-white">
                  {currentCard.word}
                </p>
                {revealed ? (
                  <div className="mt-3 flex flex-col gap-1">
                    <p lang="ja" className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                      {currentCard.reading}
                    </p>
                    <p className="text-base text-slate-800 dark:text-slate-200">{currentCard.meaning}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {currentCard.partOfSpeech}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    Reveal the reading and meaning
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                No vocabulary matches the current filters.
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setRevealed((value) => !value)}
                disabled={!currentCard}
                className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-bold text-white disabled:opacity-50 dark:bg-emerald-600"
              >
                {revealed ? "Hide answer" : "Reveal"}
              </button>
              <button
                type="button"
                onClick={previousCard}
                disabled={!currentCard}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextCard}
                disabled={!currentCard}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              >
                Next
              </button>
            </div>
          </div>

          <div
            id="quiz"
            className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">Quick quiz</h3>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                Score: {quizScore}
              </span>
            </div>

            {currentQuestion ? (
              <>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                  What does this mean?
                </p>
                <p lang="ja" className="mt-1 text-3xl font-black text-slate-950 dark:text-white">
                  {currentQuestion.word}
                </p>
                <div className="mt-4 grid gap-2">
                  {quizOptions.map((option, index) => {
                    const isCorrect = option === currentQuestion.meaning;
                    const isChosen = quizAnswer === index;
                    const showResult = quizAnswer !== null;
                    return (
                      <button
                        key={`${option}-${index}`}
                        type="button"
                        onClick={() => answerQuiz(index)}
                        disabled={showResult}
                        className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold transition-colors disabled:cursor-default ${
                          showResult && isCorrect
                            ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
                            : showResult && isChosen
                              ? "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/50 dark:text-rose-200"
                              : "border-slate-300 text-slate-800 hover:border-emerald-600 dark:border-slate-700 dark:text-slate-200"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {quizAnswer !== null && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p
                      aria-live="polite"
                      className={`text-sm font-bold ${
                        quizOptions[quizAnswer] === currentQuestion.meaning
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-rose-700 dark:text-rose-400"
                      }`}
                    >
                      {quizOptions[quizAnswer] === currentQuestion.meaning
                        ? "Correct!"
                        : `Answer: ${currentQuestion.meaning}`}
                    </p>
                    <button
                      type="button"
                      onClick={nextQuestion}
                      className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
                    >
                      Next question
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                No vocabulary matches the current filters.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Dataset">
          {(["kanji", "vocab"] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                tab === value
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                  : "border border-slate-300 text-slate-700 hover:border-slate-500 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              {value === "kanji" ? `Kanji (${kanji.length})` : `Vocabulary (${vocab.length})`}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Search {level}
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              tab === "kanji"
                ? "Try 日, sun, or にち…"
                : "Try 食べる, たべる, or to eat…"
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-emerald-900"
          />
        </label>

        <div className="flex flex-wrap gap-2" aria-label="Filters">
          {(tab === "kanji" ? strokeFilters : posFilters).map((filter) => {
            const active =
              tab === "kanji"
                ? strokeFilter === filter.value
                : posFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  tab === "kanji"
                    ? setStrokeFilter(filter.value as StrokeFilter)
                    : setPosFilter(filter.value as PosFilter)
                }
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                  active
                    ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-500 dark:bg-emerald-600"
                    : "border-slate-300 text-slate-700 hover:border-emerald-600 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing {Math.min(visibleCount, resultCount)} of {resultCount} results
        </p>

        {tab === "kanji" ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleKanji.map((item) => (
              <li key={item.character}>
                <Link
                  href={kanjiHref(item.character)}
                  className="flex h-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span lang="ja" className="text-5xl leading-none font-black text-slate-950 dark:text-white">
                      {item.character}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {item.strokes} strokes
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {item.meanings.slice(0, 3).join(" · ")}
                  </p>
                  <p lang="ja" className="text-xs text-slate-500 dark:text-slate-400">
                    {[...item.onyomi, ...item.kunyomi].slice(0, 4).join(" / ")}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleVocab.map((item) => (
              <li
                key={`${item.word}-${item.reading}`}
                className="flex h-full flex-col gap-1.5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <p lang="ja" className="text-2xl font-black text-slate-950 dark:text-white">
                  {item.word}
                </p>
                <p lang="ja" className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  {item.reading}
                </p>
                <p className="text-sm text-slate-800 dark:text-slate-200">{item.meaning}</p>
                <p className="mt-auto text-xs text-slate-500 dark:text-slate-400">
                  {item.partOfSpeech}
                </p>
              </li>
            ))}
          </ul>
        )}

        {resultCount > visibleCount && (
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="mx-auto rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-800 hover:border-emerald-600 dark:border-slate-700 dark:text-slate-200"
          >
            Show more
          </button>
        )}
      </div>
    </section>
  );
}
