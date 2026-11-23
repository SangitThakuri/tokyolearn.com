"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PronounceButton } from "@/components/PronounceButton";
import { loadAllKanjiEntries } from "@/lib/study-data";
import { isKanji } from "@/lib/text-analysis";
import { LEVELS } from "@/lib/site";
import type { JlptLevel, KanjiEntry } from "@/types/japanese";

const LEVEL_STYLES: Record<JlptLevel | "unknown", string> = {
  N5: "border-emerald-300 bg-emerald-100 text-emerald-950 hover:border-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200",
  N4: "border-sky-300 bg-sky-100 text-sky-950 hover:border-sky-600 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-200",
  N3: "border-violet-300 bg-violet-100 text-violet-950 hover:border-violet-600 dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-200",
  N2: "border-amber-300 bg-amber-100 text-amber-950 hover:border-amber-600 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200",
  N1: "border-rose-300 bg-rose-100 text-rose-950 hover:border-rose-600 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200",
  unknown:
    "border-slate-300 bg-slate-100 text-slate-600 hover:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

const SAMPLE =
  "日本語の勉強は毎日少しずつ続けることが大切です。東京では電車に乗って大学へ行きます。";

export function KanjiHighlighter() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<KanjiEntry[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadAllKanjiEntries()
      .then((result) => {
        if (active) setEntries(result);
      })
      .catch(() => {
        if (active) setLoadError("Kanji data could not be loaded. Please refresh.");
      });
    return () => {
      active = false;
    };
  }, []);

  const lookup = useMemo(() => {
    const map = new Map<string, KanjiEntry>();
    for (const entry of entries ?? []) {
      if (!map.has(entry.character)) map.set(entry.character, entry);
    }
    return map;
  }, [entries]);

  const characters = useMemo(() => Array.from(text), [text]);
  const highlighted = characters.filter((char) => isKanji(char)).length;
  const selectedEntry = selected ? lookup.get(selected) : undefined;
  const selectedKnown = selectedEntry !== undefined;
  const selectedLevel = selectedEntry?.jlpt ?? "unknown";

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <label
          htmlFor="highlighter-input"
          className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
        >
          Your Japanese text
        </label>
        <textarea
          id="highlighter-input"
          lang="ja"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setSelected(null);
          }}
          placeholder="日本語の文章をここに貼り付けてください…"
          className="min-h-[200px] w-full resize-y rounded-2xl border border-slate-300 bg-white p-4 text-lg leading-relaxed text-slate-950 shadow-sm focus:border-emerald-600 focus:outline-2 focus:outline-emerald-600 sm:min-h-[240px] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setText(SAMPLE);
              setSelected(null);
            }}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-emerald-600 dark:border-slate-700 dark:text-slate-300"
          >
            Load sample
          </button>
          <button
            type="button"
            onClick={() => {
              setText("");
              setSelected(null);
            }}
            disabled={!text}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
          >
            Clear
          </button>
          <span className="ml-auto text-sm text-slate-600 dark:text-slate-400">
            {loadError || (entries ? `${highlighted} kanji found` : "Loading kanji data…")}
          </span>
        </div>
      </section>

      <section
        aria-label="Level legend"
        className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
      >
        <span className="text-xs font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
          Legend
        </span>
        {[...LEVELS, "unknown" as const].map((level) => (
          <span key={level} className="flex items-center gap-1.5 text-xs font-bold">
            <span
              aria-hidden="true"
              className={`inline-block size-3 rounded border ${LEVEL_STYLES[level]}`}
            />
            <span className="text-slate-700 dark:text-slate-300">
              {level === "unknown" ? "Other" : level}
            </span>
          </span>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
          Highlighted text
        </h2>
        <div
          lang="ja"
          className="min-h-[140px] whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-white p-5 text-2xl leading-loose text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        >
          {characters.length === 0 ? (
            <span className="text-base font-normal text-slate-400 dark:text-slate-500">
              Paste text above to see kanji color-coded by JLPT level.
            </span>
          ) : (
            characters.map((char, index) => {
              if (!isKanji(char)) return <span key={index}>{char}</span>;
              const entry = lookup.get(char);
              const level = entry?.jlpt ?? "unknown";
              const active = selected === char;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelected(char)}
                  aria-label={`Inspect kanji ${char}, JLPT ${level}`}
                  title={entry ? `${entry.jlpt} · ${entry.meanings.join(", ")}` : "Outside N5–N1 data"}
                  className={`mx-px inline rounded-md border px-0.5 py-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-600 ${LEVEL_STYLES[level]} ${active ? "ring-2 ring-emerald-500 ring-offset-1 dark:ring-offset-slate-900" : ""}`}
                >
                  {char}
                </button>
              );
            })
          )}
        </div>
      </section>

      {selected && (
        <section
          aria-live="polite"
          className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900 dark:bg-emerald-950/30"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black tracking-widest text-emerald-700 uppercase dark:text-emerald-400">
                Selected kanji
              </p>
              <p lang="ja" className="mt-2 text-5xl font-black text-slate-950 dark:text-white">
                {selected}
              </p>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-black ${LEVEL_STYLES[selectedLevel]}`}
            >
              {selectedKnown ? `JLPT ${selectedEntry.jlpt}` : "Outside N5–N1"}
            </span>
          </div>

          {selectedEntry ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-[11px] font-bold text-slate-500 uppercase dark:text-slate-400">
                      On’yomi
                    </dt>
                    <dd lang="ja" className="mt-1 font-bold text-slate-900 dark:text-white">
                      {selectedEntry.onyomi.join("、") || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold text-slate-500 uppercase dark:text-slate-400">
                      Kun’yomi
                    </dt>
                    <dd lang="ja" className="mt-1 font-bold text-slate-900 dark:text-white">
                      {selectedEntry.kunyomi.join("、") || "—"}
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                  {selectedEntry.meanings.join(" · ")}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <PronounceButton text={selected} compact />
                  <Link
                    href={`/kanji/${selected}/`}
                    className="text-sm font-bold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
                  >
                    Full kanji page →
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase dark:text-slate-400">
                  Example words
                </p>
                <ul className="mt-2 flex flex-col divide-y divide-slate-200 dark:divide-slate-800">
                  {selectedEntry.examples.slice(0, 2).map((example) => (
                    <li key={example.word} className="flex items-baseline justify-between gap-3 py-2">
                      <span lang="ja" className="text-lg font-bold text-slate-950 dark:text-white">
                        {example.word}
                        <span className="ml-2 text-xs font-normal text-emerald-700 dark:text-emerald-400">
                          {example.reading}
                        </span>
                      </span>
                      <span className="text-right text-sm text-slate-600 dark:text-slate-400">
                        {example.meaning}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
              This character is not in the N5–N1 datasets, so no reading is available
              here yet.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
