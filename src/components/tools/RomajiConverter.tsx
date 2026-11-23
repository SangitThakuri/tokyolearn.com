"use client";

import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/tools/CopyButton";
import { convertText } from "@/lib/kana";
import {
  loadAllKanjiEntries,
  primaryReading,
  toHiragana,
} from "@/lib/study-data";
import type { KanjiEntry } from "@/types/japanese";

const SAMPLE = "こんにちは、せかい！今日はいい天気です。";

export function RomajiConverter() {
  const [text, setText] = useState("");
  const [lookup, setLookup] = useState<Map<string, KanjiEntry> | null>(null);

  useEffect(() => {
    let active = true;
    loadAllKanjiEntries()
      .then((entries) => {
        if (!active) return;
        const map = new Map<string, KanjiEntry>();
        for (const entry of entries) {
          if (!map.has(entry.character)) map.set(entry.character, entry);
        }
        setLookup(map);
      })
      .catch(() => {
        if (active) setLookup(new Map());
      });
    return () => {
      active = false;
    };
  }, []);

  const output = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return "";
    const prepared = lookup
      ? Array.from(trimmed)
          .map((char) => {
            const entry = lookup.get(char);
            return entry ? toHiragana(primaryReading(entry)) : char;
          })
          .join("")
      : trimmed;
    return convertText(prepared, "hiragana", "romaji");
  }, [text, lookup]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="romaji-input"
            className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
          >
            Japanese text
          </label>
          <button
            type="button"
            onClick={() => setText(SAMPLE)}
            className="text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-400"
          >
            Load sample
          </button>
        </div>
        <textarea
          id="romaji-input"
          lang="ja"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="日本語の文章を入力…"
          className="min-h-[260px] w-full resize-y rounded-2xl border border-slate-300 bg-white p-4 text-xl leading-relaxed text-slate-950 shadow-sm focus:border-emerald-600 focus:outline-2 focus:outline-emerald-600 sm:min-h-[300px] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
        <button
          type="button"
          onClick={() => setText("")}
          disabled={!text}
          className="self-start rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
        >
          Clear
        </button>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
            Romaji
          </h2>
          <CopyButton value={output} label="Copy romaji" />
        </div>
        <div
          aria-live="polite"
          className="min-h-[260px] w-full overflow-auto rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xl leading-relaxed font-bold break-words text-slate-950 shadow-sm sm:min-h-[300px] dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-white"
        >
          {output ? (
            <p className="whitespace-pre-wrap">{output}</p>
          ) : (
            <p className="text-base font-normal text-slate-500 dark:text-slate-500">
              Hepburn-style romaji appears here instantly.
            </p>
          )}
        </div>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Kana conversion is exact. Kanji are approximated with their first
          N5–N1 dictionary reading, so compounds may differ from word-level
          readings.
        </p>
      </section>
    </div>
  );
}
