"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { PronounceButton } from "@/components/PronounceButton";
import { LevelPicker, ProgressBar } from "@/components/study/StudyControls";
import { kanjiHref, practiceHref } from "@/lib/site";
import { loadCards, type Flashcard } from "@/lib/study-data";
import {
  deckKey,
  getProgressSnapshot,
  getServerProgressSnapshot,
  masteryStats,
  recordRating,
  resetDeck,
  subscribeProgress,
} from "@/lib/study-progress";
import { setPracticeParams, usePracticeParams } from "@/lib/url-params";
import type { Rating, StudyMode } from "@/types/study";

const MODE_LABELS: Record<StudyMode, string> = {
  kanji: "Kanji",
  vocab: "Vocabulary",
};

const GRADE_BUTTONS: { rating: Rating; label: string; key: string; className: string }[] = [
  {
    rating: "again",
    label: "Again",
    key: "1",
    className:
      "border-rose-300 text-rose-800 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40",
  },
  {
    rating: "good",
    label: "Good",
    key: "2",
    className:
      "border-amber-300 text-amber-800 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950/40",
  },
  {
    rating: "mastered",
    label: "Mastered",
    key: "3",
    className:
      "border-emerald-600 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-300 dark:hover:bg-emerald-950/40",
  },
];

export function FlashcardDeck() {
  const { level, mode } = usePracticeParams();
  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getServerProgressSnapshot,
  );

  const key = deckKey(level, mode);
  const [loadedKey, setLoadedKey] = useState("");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewOnly, setReviewOnly] = useState(false);

  // Reset the deck when the selected level or mode changes.
  if (key !== loadedKey) {
    setLoadedKey(key);
    setCards([]);
    setLoading(true);
    setLoadError("");
    setIndex(0);
    setFlipped(false);
    setReviewOnly(false);
  }

  useEffect(() => {
    let active = true;
    loadCards(level, mode)
      .then((items) => {
        if (!active) return;
        setCards(items);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoadError("This deck could not be loaded. Please try again.");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [level, mode]);

  const deckProgress = progress.flashcards[key];
  const ratings = useMemo(() => deckProgress?.ratings ?? {}, [deckProgress]);
  const stats = useMemo(
    () => masteryStats(cards.map((card) => card.id), ratings),
    [cards, ratings],
  );

  const visibleCards = useMemo(
    () =>
      reviewOnly
        ? cards.filter((card) => ratings[card.id] === "again")
        : cards,
    [cards, ratings, reviewOnly],
  );

  const position = visibleCards.length > 0 ? index % visibleCards.length : 0;
  const current = visibleCards[position];

  const flip = useCallback(() => setFlipped((value) => !value), []);
  const next = useCallback(() => {
    setFlipped(false);
    setIndex((value) => value + 1);
  }, []);
  const previous = useCallback(() => {
    setFlipped(false);
    setIndex((value) => Math.max(0, value - 1));
  }, []);

  const grade = useCallback(
    (rating: Rating) => {
      if (!current) return;
      recordRating(level, mode, current.id, rating);
      next();
    },
    [current, level, mode, next],
  );

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

      if (event.code === "Space" || event.key === " ") {
        event.preventDefault();
        flip();
      } else if (event.key === "1") {
        event.preventDefault();
        grade("again");
      } else if (event.key === "2") {
        event.preventDefault();
        grade("good");
      } else if (event.key === "3") {
        event.preventDefault();
        grade("mastered");
      } else if (event.key === "ArrowRight") {
        next();
      } else if (event.key === "ArrowLeft") {
        previous();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flip, grade, next, previous]);

  function toggleReviewOnly() {
    setReviewOnly((value) => !value);
    setIndex(0);
    setFlipped(false);
  }

  return (
    <div className="flex flex-col gap-8">
      <section aria-label="Deck settings" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
            JLPT level
          </h2>
          <Link
            href={practiceHref("quiz", level)}
            className="text-sm font-bold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
          >
            Quiz this level instead →
          </Link>
        </div>
        <LevelPicker level={level} />

        <div className="flex flex-wrap gap-2" role="group" aria-label="Card mode">
          {(["kanji", "vocab"] as const).map((item) => {
            const active = mode === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => setPracticeParams({ mode: item })}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                  active
                    ? "bg-emerald-700 text-white dark:bg-emerald-600"
                    : "border border-slate-300 text-slate-700 hover:border-emerald-600 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                {MODE_LABELS[item]}
              </button>
            );
          })}
        </div>
      </section>

      <section
        aria-label="Deck progress"
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-slate-950 dark:text-white">
            {level} {MODE_LABELS[mode].toLowerCase()} mastery
          </h2>
          <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
            {stats.percent}%
          </span>
        </div>
        <div className="mt-3">
          <ProgressBar percent={stats.percent} label="Deck mastery" />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
          <span>{stats.mastered} mastered</span>
          <span>{stats.good} good</span>
          <span>{stats.again} to review</span>
          <span>{stats.untouched} unseen</span>
          <span className="ml-auto">{deckProgress?.reviewed ?? 0} total reviews</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={toggleReviewOnly}
            disabled={stats.again === 0 && !reviewOnly}
            className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-bold text-rose-800 disabled:opacity-50 dark:border-rose-900 dark:text-rose-300"
          >
            {reviewOnly ? "Show full deck" : `Review missed (${stats.again})`}
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Reset saved progress for ${level} ${MODE_LABELS[mode].toLowerCase()}?`)) {
                resetDeck(level, mode);
              }
            }}
            disabled={!deckProgress}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-400"
          >
            Reset progress
          </button>
        </div>
      </section>

      <section aria-label="Flashcard" className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-400">
          <span>
            {loading
              ? "Loading deck…"
              : `Card ${visibleCards.length > 0 ? position + 1 : 0} of ${visibleCards.length}`}
          </span>
          <span className="hidden sm:inline">Space flips · 1 / 2 / 3 grades</span>
        </div>

        {loadError ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-sm font-semibold text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            {loadError}
          </div>
        ) : loading ? (
          <div className="flex h-[320px] items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 text-sm text-slate-500 sm:h-[380px] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Loading {level} {MODE_LABELS[mode].toLowerCase()}…
          </div>
        ) : !current ? (
          <div className="flex h-[320px] flex-col items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center sm:h-[380px] dark:border-slate-800 dark:bg-slate-900">
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {reviewOnly ? "No missed cards yet" : "No cards in this deck"}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {reviewOnly
                ? "Grade a card “Again” to add it to this review pile."
                : "Try another level or mode."}
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={flip}
            aria-label={
              flipped
                ? "Show front of flashcard"
                : "Flip flashcard to reveal reading and meaning"
            }
            className="relative block h-[320px] w-full cursor-pointer [perspective:1200px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600 sm:h-[380px]"
          >
            <span
              className={`relative block h-full w-full transform-3d transition-transform duration-500 ${
                flipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm backface-hidden dark:border-slate-800 dark:bg-slate-900">
                <span className="text-xs font-black tracking-widest text-slate-500 uppercase dark:text-slate-400">
                  {MODE_LABELS[mode]} · {level}
                </span>
                <span
                  lang="ja"
                  className="text-7xl leading-none font-black text-slate-950 sm:text-8xl dark:text-white"
                >
                  {current.front}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {current.detail}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Tap or press Space to flip
                </span>
              </span>

              <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-auto rounded-3xl border border-emerald-600 bg-emerald-50 p-6 text-center shadow-sm backface-hidden [transform:rotateY(180deg)] dark:border-emerald-700 dark:bg-emerald-950/60">
                <span
                  lang="ja"
                  className="text-4xl font-black text-emerald-900 dark:text-emerald-200"
                >
                  {current.reading}
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {current.meanings.slice(0, 3).join(" · ")}
                </span>
                {current.examples.length > 0 && (
                  <span className="mt-1 grid w-full gap-1.5 sm:grid-cols-3">
                    {current.examples.map((example, exampleIndex) => (
                      <span
                        key={`${example.word}-${exampleIndex}`}
                        className="rounded-xl bg-white/80 p-2 text-xs dark:bg-slate-900/70"
                      >
                        <span lang="ja" className="block text-base font-bold text-slate-900 dark:text-white">
                          {example.word}
                        </span>
                        <span lang="ja" className="block text-emerald-700 dark:text-emerald-400">
                          {example.reading}
                        </span>
                        <span className="block text-slate-600 dark:text-slate-400">
                          {example.meaning}
                        </span>
                      </span>
                    ))}
                  </span>
                )}
                {mode === "vocab" && (
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {current.detail}
                  </span>
                )}
              </span>
            </span>
          </button>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={previous}
            disabled={!current}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={flip}
            disabled={!current}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50 dark:bg-white dark:text-slate-950"
          >
            {flipped ? "Show front" : "Flip card"}
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!current}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
          >
            Next →
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {GRADE_BUTTONS.map((button) => (
            <button
              key={button.rating}
              type="button"
              onClick={() => grade(button.rating)}
              disabled={!current}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold disabled:opacity-50 ${button.className}`}
            >
              {button.label}
              <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {button.key}
              </kbd>
            </button>
          ))}
        </div>

        {current && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            <PronounceButton text={current.front} compact />
            {mode === "kanji" && (
              <Link
                href={kanjiHref(current.front)}
                className="text-sm font-bold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
              >
                Full kanji details →
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
