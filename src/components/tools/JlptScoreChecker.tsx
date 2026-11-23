"use client";

import { useMemo, useState } from "react";
import { jlptReference } from "@/data/reference-catalog";
import { checkJlptScores } from "@/lib/jlpt-scoring";
import { LEVEL_META, LEVELS } from "@/lib/site";
import type { JlptLevel } from "@/types/japanese";

function emptyScores(level: JlptLevel): Record<string, string> {
  const overview = jlptReference.levelsData.find((item) => item.level === level);
  return Object.fromEntries((overview?.sections ?? []).map((section) => [section.id, ""]));
}

export function JlptScoreChecker() {
  const [level, setLevel] = useState<JlptLevel>("N5");
  const [scores, setScores] = useState<Record<string, string>>(() => emptyScores("N5"));
  const [checked, setChecked] = useState(false);

  const overview = useMemo(
    () => jlptReference.levelsData.find((item) => item.level === level) ?? jlptReference.levelsData[0],
    [level],
  );
  const result = useMemo(() => checkJlptScores(overview, scores), [overview, scores]);

  function selectLevel(value: JlptLevel) {
    setLevel(value);
    setScores(emptyScores(value));
    setChecked(false);
  }

  const complete = Boolean(result);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
            Level
          </span>
          {LEVELS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => selectLevel(value)}
              aria-pressed={level === value}
              className={`rounded-lg border px-3 py-1.5 text-sm font-bold transition-colors ${
                level === value
                  ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-500 dark:bg-emerald-600"
                  : "border-slate-200 bg-white text-slate-700 hover:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                {overview.label.en}
              </h2>
              <p lang="ja" className="text-sm text-slate-500 dark:text-slate-400">
                {overview.label.ja}
              </p>
            </div>
            <span
              className={`rounded-lg border px-3 py-1 text-xs font-black ${LEVEL_META[level].softAccent} ${LEVEL_META[level].accent}`}
            >
              Overall pass mark: {overview.totalPass} / {overview.totalMax}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {overview.sections.map((section) => (
              <div
                key={section.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <label
                  htmlFor={`score-${section.id}`}
                  className="text-sm font-bold text-slate-800 dark:text-slate-200"
                >
                  {section.label.en}
                </label>
                <p lang="ja" className="text-xs text-slate-500 dark:text-slate-400">
                  {section.label.ja}
                </p>
                <div className="flex items-center gap-2">
                  <input
                    id={`score-${section.id}`}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={section.max}
                    value={scores[section.id] ?? ""}
                    onChange={(event) => {
                      setScores((current) => ({
                        ...current,
                        [section.id]: event.target.value,
                      }));
                      setChecked(false);
                    }}
                    placeholder={`0–${section.max}`}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-lg font-bold text-slate-950 focus:border-emerald-600 focus:outline-2 focus:outline-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                  <span className="shrink-0 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    min {section.min}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setChecked(true)}
              disabled={!complete}
              className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-800 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              Check result
            </button>
            <button
              type="button"
              onClick={() => {
                setScores(emptyScores(level));
                setChecked(false);
              }}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-emerald-600 dark:border-slate-700 dark:text-slate-300"
            >
              Clear
            </button>
            {!complete && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Enter a score in every section (within its range).
              </span>
            )}
          </div>
        </div>

        {checked && result && (
          <section
            aria-live="polite"
            className={`rounded-2xl border p-5 sm:p-6 ${
              result.passed
                ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40"
                : "border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black tracking-widest text-slate-500 uppercase dark:text-slate-400">
                  Estimated result
                </p>
                <p
                  className={`mt-1 text-3xl font-black ${result.passed ? "text-emerald-800 dark:text-emerald-300" : "text-rose-800 dark:text-rose-300"}`}
                >
                  {result.passed ? "PASS" : "FAIL"}
                </p>
              </div>
              <p className="text-right text-lg font-black text-slate-950 dark:text-white">
                {result.total} / {result.totalMax}
                <span className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  overall pass mark {result.totalPass}
                </span>
              </p>
            </div>

            <ul className="mt-5 flex flex-col gap-3">
              {result.sections.map((section) => {
                const width = Math.min(100, (section.value / section.section.max) * 100);
                return (
                  <li key={section.section.id}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {section.section.label.en}
                      </span>
                      <span
                        className={section.passed ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}
                      >
                        {section.value} / {section.section.max} · min {section.section.min}{" "}
                        {section.passed ? "✓" : "✗"}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/70 dark:bg-slate-900/60">
                      <div
                        className={`h-full rounded-full ${section.passed ? "bg-emerald-600 dark:bg-emerald-500" : "bg-rose-600 dark:bg-rose-500"}`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </section>

      <aside className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase dark:text-slate-400">
            How JLPT passing works
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            You need both the overall pass mark and the minimum score in every
            scoring section. A low score in even one section means a fail, no
            matter how high your total is.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            These thresholds are the official JLPT standards published by the
            Japan Foundation / JEES. Actual score reports use scaled scores.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
          <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
            Focus areas for {level}
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {overview.focus.map((item) => (
              <li key={item.en} className="text-sm text-slate-700 dark:text-slate-300">
                <span lang="ja" className="font-bold text-emerald-800 dark:text-emerald-400">
                  {item.ja}
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  {item.en}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
