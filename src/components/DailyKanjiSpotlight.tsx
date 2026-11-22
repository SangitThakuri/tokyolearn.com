"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import type { KanjiEntry } from "@/types/japanese";
import { PronounceButton } from "@/components/PronounceButton";
import { kanjiHref } from "@/lib/site";

type SpotlightPick = Pick<
  KanjiEntry,
  "character" | "jlpt" | "strokes" | "meanings"
>;

interface DailyKanjiSpotlightProps {
  candidates: SpotlightPick[];
}

const noopSubscribe = () => () => {};

function todayIndex(length: number): number {
  if (length === 0) return 0;
  const now = new Date();
  const dayOfYear = Math.floor(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
      Date.UTC(now.getFullYear(), 0, 0)) /
      86_400_000,
  );
  return dayOfYear % length;
}

export function DailyKanjiSpotlight({ candidates }: DailyKanjiSpotlightProps) {
  const getSnapshot = useCallback(
    () => todayIndex(candidates.length),
    [candidates.length],
  );
  const index = useSyncExternalStore(noopSubscribe, getSnapshot, () => 0);
  const pick = candidates[index] ?? candidates[0];
  if (!pick) return null;

  return (
    <section
      aria-labelledby="daily-kanji-heading"
      className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 dark:border-emerald-900 dark:bg-emerald-950/30"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          id="daily-kanji-heading"
          className="text-sm font-bold tracking-[0.18em] text-emerald-800 uppercase dark:text-emerald-400"
        >
          Daily kanji spotlight
        </h2>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-slate-900 dark:text-emerald-300">
          {pick.jlpt}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
        <Link
          href={kanjiHref(pick.character)}
          className="flex size-28 shrink-0 items-center justify-center rounded-2xl bg-white text-7xl font-black text-slate-950 shadow-sm transition-transform hover:scale-[1.03] sm:size-32 sm:text-8xl dark:bg-slate-900 dark:text-white"
          aria-label={`View details for kanji ${pick.character}`}
        >
          <span lang="ja">{pick.character}</span>
        </Link>

        <div className="flex flex-col gap-3">
          <p className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
            {pick.meanings.slice(0, 3).join(" · ")}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {pick.strokes} strokes · featured from the {pick.jlpt} set
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <PronounceButton text={pick.character} compact />
            <Link
              href={kanjiHref(pick.character)}
              className="text-sm font-bold text-emerald-800 underline-offset-4 hover:underline dark:text-emerald-400"
            >
              Full kanji page →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
