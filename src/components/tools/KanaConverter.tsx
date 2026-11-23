"use client";

import { useMemo, useState } from "react";
import {
  convertText,
  type Script,
} from "@/lib/kana";

const SCRIPTS: { value: Script; label: string; sample: string }[] = [
  { value: "romaji", label: "Romaji", sample: "konnichiwa, sekai!" },
  { value: "hiragana", label: "Hiragana", sample: "こんにちは、せかい！" },
  { value: "katakana", label: "Katakana", sample: "コンニチハ、セカイ！" },
];

export function KanaConverter() {
  const [text, setText] = useState("");
  const [from, setFrom] = useState<Script>("hiragana");
  const [to, setTo] = useState<Script>("katakana");

  const output = useMemo(() => {
    const trimmed = text.trim();
    return trimmed ? convertText(trimmed, from, to) : "";
  }, [text, from, to]);

  const [copiedOutput, setCopiedOutput] = useState("");
  const copied = copiedOutput === output && output !== "";

  function onInput(value: string) {
    setText(value);
    setCopiedOutput("");
  }

  function swap() {
    setText(output);
    setCopiedOutput("");
    setFrom(to);
    setTo(from);
  }

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopiedOutput(output);
    } catch {
      setCopiedOutput("");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section
        aria-label="Conversion settings"
        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="from-script"
              className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
            >
              From
            </label>
            <select
              id="from-script"
              value={from}
              onChange={(event) => setFrom(event.target.value as Script)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base font-bold text-slate-950 focus:border-emerald-600 focus:outline-2 focus:outline-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {SCRIPTS.map((script) => (
                <option key={script.value} value={script.value}>
                  {script.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={swap}
            aria-label="Swap source and target scripts"
            className="mx-auto rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-emerald-600 hover:text-emerald-700 sm:mb-0.5 dark:border-slate-700 dark:text-slate-300 dark:hover:text-emerald-400"
          >
            ⇄ Swap
          </button>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="to-script"
              className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
            >
              To
            </label>
            <select
              id="to-script"
              value={to}
              onChange={(event) => setTo(event.target.value as Script)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base font-bold text-slate-950 focus:border-emerald-600 focus:outline-2 focus:outline-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {SCRIPTS.map((script) => (
                <option key={script.value} value={script.value}>
                  {script.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="converter-input"
              className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
            >
              Input
            </label>
            <button
              type="button"
              onClick={() => {
                const sample = SCRIPTS.find((script) => script.value === from)?.sample ?? "";
                onInput(sample);
              }}
              className="text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Load sample
            </button>
          </div>
          <textarea
            id="converter-input"
            lang={from === "romaji" ? undefined : "ja"}
            value={text}
            onChange={(event) => onInput(event.target.value)}
            placeholder={
              SCRIPTS.find((script) => script.value === from)?.sample ?? ""
            }
            className="min-h-[240px] w-full resize-y rounded-2xl border border-slate-300 bg-white p-4 text-xl leading-relaxed text-slate-950 shadow-sm focus:border-emerald-600 focus:outline-2 focus:outline-emerald-600 sm:min-h-[280px] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
              Output
            </h2>
            <button
              type="button"
              onClick={copy}
              disabled={!output}
              className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-800 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {copied ? "Copied!" : "Copy output"}
            </button>
            <button
              type="button"
              onClick={() => onInput(output)}
              disabled={!output}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
            >
              Use output as input
            </button>
          </div>
          <div
            lang={to === "romaji" ? undefined : "ja"}
            className="min-h-[240px] w-full overflow-auto rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xl leading-relaxed font-bold text-slate-950 shadow-sm sm:min-h-[280px] dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-white"
          >
            {output ? (
              <p className="break-words whitespace-pre-wrap">{output}</p>
            ) : (
              <p className="text-base font-normal text-slate-500 dark:text-slate-500">
                Converted text appears here instantly.
              </p>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500" aria-live="polite">
            {copied
              ? "Copied to clipboard."
              : "Hepburn-style romaji. English words that are not Japanese are left unchanged."}
          </p>
        </section>
      </div>
    </div>
  );
}
