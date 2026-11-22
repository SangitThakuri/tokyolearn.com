"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  analyzeText,
  percent,
  type ScriptCounts,
  type TextAnalysis,
} from "@/lib/text-analysis";
import { loadAllKanji } from "@/lib/study-data";
import type { JlptLevel } from "@/types/japanese";

const SCRIPT_CARDS: {
  key: keyof Omit<ScriptCounts, "total" | "japanese">;
  label: string;
  language?: "ja";
  className: string;
}[] = [
  {
    key: "kanji",
    label: "Kanji",
    language: "ja",
    className: "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40",
  },
  {
    key: "hiragana",
    label: "Hiragana",
    language: "ja",
    className: "border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/40",
  },
  {
    key: "katakana",
    label: "Katakana",
    language: "ja",
    className: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40",
  },
];

const SAMPLE =
  "日本語の勉強は毎日少しずつ続けることが大切です。東京では電車に乗って大学へ行きます。";

export function TextAnalyzer() {
  const [text, setText] = useState("");
  const [sets, setSets] = useState<Record<JlptLevel, Set<string>> | null>(
    null,
  );
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    loadAllKanji()
      .then((result) => {
        if (!active) return;
        setSets(result);
      })
      .catch(() => {
        if (!active) return;
        setLoadError("JLPT data could not be loaded. Please refresh the page.");
      });
    return () => {
      active = false;
    };
  }, []);

  const analysis: TextAnalysis | null = useMemo(
    () => (sets ? analyzeText(text, sets) : null),
    [text, sets],
  );

  const knownUnique = analysis
    ? analysis.levels.reduce((sum, level) => sum + level.unique, 0)
    : 0;

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <label
          htmlFor="analyzer-input"
          className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
        >
          Your Japanese text
        </label>
        <textarea
          id="analyzer-input"
          lang="ja"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="日本語の文章をここに貼り付けてください…"
          className="min-h-[220px] w-full resize-y rounded-2xl border border-slate-300 bg-white p-4 text-lg leading-relaxed text-slate-950 shadow-sm focus:border-emerald-600 focus:outline-2 focus:outline-emerald-600 sm:min-h-[260px] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setText(SAMPLE)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-emerald-600 dark:border-slate-700 dark:text-slate-300"
            >
              Load sample
            </button>
            <button
              type="button"
              onClick={() => setText("")}
              disabled={!text}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
            >
              Clear
            </button>
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {Array.from(text).filter((char) => !/\s/.test(char)).length}{" "}
            non-space characters
          </span>
        </div>
      </section>

      {loadError ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-semibold text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {loadError}
        </p>
      ) : !analysis ? (
        <p className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Loading JLPT character sets…
        </p>
      ) : (
        <>
          <section aria-label="Character counts" className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              Character counts
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-3xl font-black text-slate-950 dark:text-white">
                  {analysis.counts.total}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-400">
                  Total characters
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                  Excludes spaces and line breaks
                </p>
              </div>
              {SCRIPT_CARDS.map((card) => (
                <div
                  key={card.key}
                  className={`rounded-2xl border p-5 ${card.className}`}
                >
                  <p
                    lang={card.language}
                    className="text-3xl font-black text-slate-950 dark:text-white"
                  >
                    {analysis.counts[card.key]}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                    {card.label}
                  </p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    {percent(analysis.counts[card.key], analysis.counts.japanese)}%
                    of Japanese characters
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-label="JLPT level distribution"
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                Estimated JLPT level distribution
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Based on {knownUnique} distinct level-matched kanji
                {analysis.kanjiCharacters.length > 0
                  ? ` out of ${analysis.kanjiCharacters.length} kanji found`
                  : ""}
                .
              </p>
            </div>

            {analysis.kanjiCharacters.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
                Paste Japanese text containing kanji to see the distribution.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {analysis.levels.map((stat) => {
                  const width = percent(stat.unique, knownUnique || 1);
                  return (
                    <div
                      key={stat.level}
                      className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                    >
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <Link
                          href={`/jlpt/${stat.level.toLowerCase()}`}
                          className="font-black text-emerald-700 hover:underline dark:text-emerald-400"
                        >
                          {stat.level}
                        </Link>
                        <span className="text-slate-600 dark:text-slate-400">
                          {stat.unique} unique · {stat.occurrences} uses
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                        {width}% of matched distinct kanji
                      </p>
                    </div>
                  );
                })}
                {analysis.unknownKanji.length > 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 sm:col-span-2 dark:border-amber-900 dark:bg-amber-950/30">
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-300">
                      {analysis.unknownKanji.length} kanji outside the N5–N1
                      datasets
                    </p>
                    <p
                      lang="ja"
                      className="mt-2 break-all text-xl font-bold tracking-widest text-amber-950 dark:text-amber-200"
                    >
                      {analysis.unknownKanji.join(" ")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
