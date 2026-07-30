"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Flashcard from "@/components/Flashcard";
import { getAllVocabulary, getAllKanji, getAllGrammar } from "@/content/index";
import {
  getDueItems,
  addItemToSRS,
  updateItemQuality,
  getSRSData,
  type SRSItem,
} from "@/lib/srs";

type FilterMode = "all" | "vocab" | "kanji" | "grammar";
type StudyMode = "all-levels" | "level";

function buildCard(item: SRSItem): { front: string; back: string } {
  return { front: item.front, back: item.back };
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

export default function FlashcardsPage() {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [studyMode, setStudyMode] = useState<StudyMode>("all-levels");
  const [queue, setQueue] = useState<SRSItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studiedToday, setStudiedToday] = useState(0);
  const [streak, setStreak] = useState(0);
  const [dueCount, setDueCount] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [empty, setEmpty] = useState(false);

  const seedCards = useCallback(() => {
    const existing = getSRSData();
    const existingIds = new Set(existing.map((i) => i.id));
    const now = Date.now();

    for (const v of getAllVocabulary()) {
      if (!existingIds.has(v.id)) {
        addItemToSRS({
          id: v.id,
          type: "vocab",
          front: v.word,
          back: `${v.reading} — ${v.meaning}`,
          level: v.level,
          nextReview: now,
          interval: 0,
          ease: 2.5,
          repetitions: 0,
        });
      }
    }
    for (const k of getAllKanji()) {
      if (!existingIds.has(k.id)) {
        addItemToSRS({
          id: k.id,
          type: "kanji",
          front: k.character,
          back: `${k.meaning} (音: ${k.onyomi.join("・")} / 訓: ${k.kunyomi.join("・")})`,
          level: k.level,
          nextReview: now,
          interval: 0,
          ease: 2.5,
          repetitions: 0,
        });
      }
    }
    for (const g of getAllGrammar()) {
      if (!existingIds.has(g.id)) {
        addItemToSRS({
          id: g.id,
          type: "grammar",
          front: g.title,
          back: g.meaning,
          level: g.level,
          nextReview: now,
          interval: 0,
          ease: 2.5,
          repetitions: 0,
        });
      }
    }
  }, []);

  const refreshQueue = useCallback(() => {
    const due = getDueItems();
    setDueCount(due.length);
    setQueue(due);
    setCurrentIndex(0);
    setEmpty(due.length === 0);

    const srsData = getSRSData();
    const today = new Date();
    const todayStr = today.toDateString();
    const studied = srsData.filter((i) => {
      const reviewDate = new Date(i.nextReview - i.interval * 24 * 60 * 60 * 1000);
      return reviewDate.toDateString() === todayStr && i.repetitions > 0;
    }).length;
    setStudiedToday(studied);

    let s = 0;
    let d = new Date();
    while (true) {
      const checkStr = d.toDateString();
      const count = srsData.filter((i) => {
        const reviewDate = new Date(i.nextReview - i.interval * 24 * 60 * 60 * 1000);
        return reviewDate.toDateString() === checkStr && i.repetitions > 0;
      }).length;
      if (count === 0) break;
      s++;
      d.setDate(d.getDate() - 1);
    }
    setStreak(s);
  }, []);

  useEffect(() => {
    seedCards();
    refreshQueue();
    setInitialized(true);
  }, [seedCards, refreshQueue]);

  const filteredQueue = useMemo(() => {
    if (filter === "all") return queue;
    return queue.filter((item) => item.type === filter);
  }, [queue, filter]);

  const currentCard = filteredQueue[currentIndex];

  const handleRate = useCallback(
    (quality: number) => {
      if (!currentCard) return;
      updateItemQuality(currentCard.id, quality);
      if (currentIndex < filteredQueue.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        refreshQueue();
      }
      setStudiedToday((s) => s + 1);
    },
    [currentCard, currentIndex, filteredQueue.length, refreshQueue]
  );

  if (!initialized) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Flashcards</h1>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400">
        Spaced repetition flashcards. Review due cards daily to build long-term memory.
      </p>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{dueCount}</div>
          <div className="text-xs text-zinc-500">Due today</div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{studiedToday}</div>
          <div className="text-xs text-zinc-500">Studied today</div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{streak}</div>
          <div className="text-xs text-zinc-500">Day streak</div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700">
          {(["all", "vocab", "kanji", "grammar"] as FilterMode[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium capitalize transition-colors first:rounded-l-lg last:rounded-r-lg ${
                filter === f
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700">
          {[
            { value: "all-levels", label: "All Levels" },
            { value: "level", label: "Study Level" },
          ].map((m) => (
            <button
              key={m.value}
              onClick={() => setStudyMode(m.value as StudyMode)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors first:rounded-l-lg last:rounded-r-lg ${
                studyMode === m.value
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <button
          onClick={refreshQueue}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Refresh
        </button>
      </div>

      {empty || filteredQueue.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 py-20 dark:border-zinc-800">
          <div className="mb-2 text-5xl">🎉</div>
          <p className="text-lg font-semibold text-zinc-900 dark:text-white">
            All caught up!
          </p>
          <p className="text-sm text-zinc-500">
            No due flashcards right now. Check back later or add more content.
          </p>
        </div>
      ) : currentCard ? (
        <div className="flex flex-col items-center gap-4">
          <div className="text-sm text-zinc-500">
            {currentIndex + 1} / {filteredQueue.length}
          </div>
          <Flashcard
            key={currentCard.id}
            front={buildCard(currentCard).front}
            back={buildCard(currentCard).back}
            onRate={handleRate}
          />
        </div>
      ) : null}
    </div>
  );
}
