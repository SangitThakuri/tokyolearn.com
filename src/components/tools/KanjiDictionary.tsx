"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadAllKanjiEntries, toHiragana } from "@/lib/study-data";
import { LEVEL_META, LEVELS } from "@/lib/site";
import type { KanjiEntry } from "@/types/japanese";

const RESULT_LIMIT = 60;

function normalizeKana(value: string): string {
  return toHiragana(value.normalize("NFKC")).toLowerCase();
}

function normalizeEnglish(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function KanjiDictionary() {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<KanjiEntry[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    loadAllKanjiEntries()
      .then((result) => {
        if (active) setEntries(result);
      })
      .catch(() => {
        if (active) setError("Kanji data could not be loaded. Please refresh.");
      });
    return () => {
      active = false;
    };
  }, []);

  const results = useMemo(() => {
    if (!entries) return [];
    const raw = query.trim();
    if (!raw) return entries.filter((entry) => entry.jlpt === "N5").slice(0, 12);

    const kana = normalizeKana(raw);
    const english = normalizeEnglish(raw);
    return entries
      .filter((entry) => {
        if (entry.character.includes(raw)) return true;
        const readings = normalizeKana(
          [...entry.onyomi, ...entry.kunyomi].join(" "),
        );
        if (kana && readings.includes(kana)) return true;
        const meanings = normalizeEnglish(entry.meanings.join(" "));
        return Boolean(english && meanings.includes(english));
      })
      .slice(0, RESULT_LIMIT);
  }, [entries, query]);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <label
          htmlFor="kanji-query"
          className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
        >
          Search kanji
        </label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
          >
            ⌕
          </span>
          <input
            id="kanji-query"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="学, がく, study, がくせい…"
            className="w-full rounded-2xl border border-slate-300 bg-white py-4 pr-4 pl-11 text-lg text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-2 focus:outline-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Try:</span>
          {["学", "がく", "study", " water "].map((example) => (
            <button
              key={example.trim()}
              type="button"
              onClick={() => setQuery(example)}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:hover:text-emerald-400"
            >
              {example.trim() || "water"}
            </button>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          {query.trim() ? "Search results" : "Popular N5 kanji"}
        </h2>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {error || (entries ? `${results.length} shown` : "Loading…")}
        </span>
      </div>

      {entries && results.length === 0 && query.trim() ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-base font-bold text-slate-900 dark:text-white">
            No kanji found for “{query.trim()}”.
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Search by character, kana reading, or English meaning.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((entry) => {
            const meta = LEVEL_META[entry.jlpt];
            return (
              <li key={`${entry.jlpt}-${entry.character}`}>
                <article className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-emerald-400 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/kanji/${entry.character}/`}
                      lang="ja"
                      className="text-5xl leading-none font-black text-slate-950 hover:text-emerald-700 dark:text-white dark:hover:text-emerald-400"
                    >
                      {entry.character}
                    </Link>
                    <span
                      className={`rounded-lg border px-2 py-1 text-xs font-black ${meta.softAccent} ${meta.accent}`}
                    >
                      {entry.jlpt}
                    </span>
                  </div>
                  <p lang="ja" className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    {entry.onyomi.join("、") || "—"}
                    {entry.kunyomi.length > 0 ? ` · ${entry.kunyomi.join("、")}` : ""}
                  </p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {entry.meanings.join(", ")}
                  </p>
                  <p lang="ja" className="mt-auto text-xs text-slate-500 dark:text-slate-500">
                    {entry.examples[0]
                      ? `${entry.examples[0].word}（${entry.examples[0].reading}）`
                      : `${entry.strokes} strokes`}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      {entries && results.length === RESULT_LIMIT && query.trim() && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Showing the first {RESULT_LIMIT} matches. Narrow your search for more
          precise results.
        </p>
      )}

      <p className="text-center text-xs text-slate-500 dark:text-slate-500">
        {entries
          ? `Searching all ${entries.length} kanji across ${LEVELS.join(" / ")}`
          : "Loading dictionary data…"}
      </p>
    </div>
  );
}
