"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadAllKanjiEntries, loadKanji, toHiragana } from "@/lib/study-data";
import { LEVELS } from "@/lib/site";
import type { JlptLevel, KanjiEntry } from "@/types/japanese";

type LevelFilter = JlptLevel | "all";
const PAGE_SIZE = 400;

const LEVEL_BUTTON_STYLES: Record<LevelFilter, string> = {
  all: "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-500 dark:bg-emerald-600",
  N5: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  N4: "border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
  N3: "border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300",
  N2: "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  N1: "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
};

export function KanjiGrid() {
  const [level, setLevel] = useState<LevelFilter>("N5");
  const [entries, setEntries] = useState<KanjiEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  function selectLevel(value: LevelFilter) {
    setLevel(value);
    setLoading(true);
    setVisible(PAGE_SIZE);
  }

  useEffect(() => {
    let active = true;
    const promise =
      level === "all" ? loadAllKanjiEntries() : loadKanji(level);
    promise
      .then((result) => {
        if (active) {
          setEntries(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setEntries([]);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [level]);

  const filtered = useMemo(() => {
    const raw = query.trim();
    if (!raw) return entries;
    const kana = toHiragana(raw).toLowerCase();
    const english = raw.toLowerCase();
    return entries.filter((entry) => {
      if (entry.character.includes(raw)) return true;
      if (
        kana &&
        toHiragana([...entry.onyomi, ...entry.kunyomi].join(" ")).includes(kana)
      ) {
        return true;
      }
      return entry.meanings.some((meaning) =>
        meaning.toLowerCase().includes(english),
      );
    });
  }, [entries, query]);

  const shown = filtered.slice(0, visible);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
            Level
          </span>
          {(["all", ...LEVELS] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => selectLevel(value)}
              aria-pressed={level === value}
              className={`rounded-lg border px-3 py-1.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                level === value
                  ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-500 dark:bg-emerald-600"
                  : LEVEL_BUTTON_STYLES[value]
              }`}
            >
              {value === "all" ? "All" : value}
            </button>
          ))}
        </div>
        <div>
          <label htmlFor="grid-filter" className="sr-only">
            Filter kanji by character, reading, or meaning
          </label>
          <input
            id="grid-filter"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Filter by character, reading, or meaning…"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-base text-slate-950 focus:border-emerald-600 focus:outline-2 focus:outline-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          {level === "all" ? "All levels" : `JLPT ${level}`} kanji
        </h2>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {loading ? "Loading…" : `${filtered.length} characters`}
        </span>
      </div>

      {loading ? (
        <p className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Loading kanji grid…
        </p>
      ) : shown.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No kanji match that filter.
        </p>
      ) : (
        <>
          <ul className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 lg:grid-cols-12">
            {shown.map((entry) => (
              <li key={`${entry.jlpt}-${entry.character}`}>
                <Link
                  href={`/kanji/${entry.character}/`}
                  lang="ja"
                  title={`${entry.character} · ${entry.meanings.join(", ")} (${entry.jlpt})`}
                  className="grid aspect-square place-items-center rounded-lg border border-slate-200 bg-white text-xl font-bold text-slate-800 transition-colors hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-600 sm:text-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
                >
                  {entry.character}
                </Link>
              </li>
            ))}
          </ul>
          {filtered.length > shown.length && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setVisible((count) => count + PAGE_SIZE)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-emerald-600 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:text-emerald-400"
              >
                Show {Math.min(PAGE_SIZE, filtered.length - shown.length)} more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
