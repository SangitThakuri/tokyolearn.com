"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProgress } from "@/lib/progress";
import { getSRSData, getDueItems, getCurrentStreak } from "@/lib/srs";
import { levels } from "@/lib/levels";
import ProgressBar from "@/components/ProgressBar";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
            />
          ))}
        </div>
      </div>
    );
  }

  const progress = getProgress();
  const srs = getSRSData();
  const dueCount = getDueItems().length;
  const streak = getCurrentStreak();

  const totalGrammar = levels.reduce(
    (sum, l) => sum + l.grammarCount,
    0,
  );
  const totalVocab = levels.reduce((sum, l) => sum + l.vocabCount, 0);
  const totalKanji = levels.reduce((sum, l) => sum + l.kanjiCount, 0);

  const completedGrammar = Object.values(progress.levels).reduce(
    (sum, p) => sum + p.completedGrammar.length,
    0,
  );
  const completedVocab = Object.values(progress.levels).reduce(
    (sum, p) => sum + p.completedVocab.length,
    0,
  );
  const completedKanji = Object.values(progress.levels).reduce(
    (sum, p) => sum + p.completedKanji.length,
    0,
  );

  const overallTotal = totalGrammar + totalVocab + totalKanji;
  const overallDone = completedGrammar + completedVocab + completedKanji;
  const overallPct =
    overallTotal > 0
      ? Math.round((overallDone / overallTotal) * 100)
      : 0;

  const statsCards = [
    {
      label: "Grammar Points",
      value: completedGrammar,
      total: totalGrammar,
    },
    {
      label: "Vocabulary",
      value: completedVocab,
      total: totalVocab,
    },
    {
      label: "Kanji",
      value: completedKanji,
      total: totalKanji,
    },
    {
      label: "Overall",
      value: overallPct,
      total: 100,
      isPct: true,
    },
  ] as const;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Track your Japanese learning progress
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {"isPct" in stat && stat.isPct
                ? `${stat.value}%`
                : `${stat.value} / ${stat.total}`}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Cards Due
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{dueCount}</p>
          <p className="mt-1 text-xs text-zinc-500">
            {srs.length} total cards in review
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Streak
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {streak} {streak === 1 ? "day" : "days"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">consecutive days with reviews</p>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Per-Level Progress</h2>
        <div className="space-y-4">
          {levels.map((level) => {
            const total = {
              grammar: level.grammarCount,
              vocab: level.vocabCount,
              kanji: level.kanjiCount,
            };
            const prog = progress.levels[level.level];
            const done =
              (prog?.completedGrammar.length ?? 0) +
              (prog?.completedVocab.length ?? 0) +
              (prog?.completedKanji.length ?? 0);
            const tot = total.grammar + total.vocab + total.kanji;

            return (
              <Link
                key={level.level}
                href={`/${level.level}`}
                className="block rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${level.color}`}
                    />
                    <span className="text-sm font-semibold">{level.label}</span>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {done} / {tot}
                  </span>
                </div>
                <ProgressBar value={done} max={tot} />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-3 text-lg font-semibold">Continue Studying</h2>
        <div className="flex flex-wrap gap-3">
          {dueCount > 0 && (
            <Link
              href="/review"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Review {dueCount} due card{dueCount !== 1 ? "s" : ""}
            </Link>
          )}
          <Link
            href="/n5/grammar"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Study N5 grammar
          </Link>
          <Link
            href="/absolute-beginner"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Hiragana & Katakana
          </Link>
        </div>
      </div>
    </div>
  );
}
