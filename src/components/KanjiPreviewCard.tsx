"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { kanjiHref } from "@/lib/site";
import type { KanjiEntry } from "@/types/japanese";

type PreviewPick = Pick<
  KanjiEntry,
  "character" | "jlpt" | "strokes" | "onyomi" | "kunyomi" | "meanings" | "examples"
>;

const noopSubscribe = () => () => {};

function dailyIndex(length: number): number {
  if (length === 0) return 0;
  const now = new Date();
  const dayOfYear = Math.floor(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
      Date.UTC(now.getFullYear(), 0, 0)) /
      86_400_000,
  );
  return dayOfYear % length;
}

export function KanjiPreviewCard({
  candidates,
}: {
  candidates: readonly PreviewPick[];
}) {
  const getSnapshot = useCallback(
    () => dailyIndex(candidates.length),
    [candidates.length],
  );
  const dayIndex = useSyncExternalStore(noopSubscribe, getSnapshot, () => 0);
  const [offset, setOffset] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [playedText, setPlayedText] = useState("");

  if (candidates.length === 0) return null;

  const pick = candidates[(dayIndex + offset) % candidates.length];
  const examples = pick.examples.slice(0, 2);
  const played = playedText === pick.character;

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const word = pick.examples[0]?.word ?? "";
    const utterance = new SpeechSynthesisUtterance(
      word ? `${pick.character}、${word}` : pick.character,
    );
    utterance.lang = "ja-JP";
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setPlayedText(pick.character);
  };

  const nextKanji = () => {
    setOffset((value) => value + 1);
    setFlipped(false);
    setPlayedText("");
  };

  return (
    <section
      aria-labelledby="kanji-preview-heading"
      className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 text-slate-100 shadow-2xl shadow-slate-950/20 dark:border-slate-700/80"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-emerald-500/15 blur-3xl"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black tracking-[0.2em] text-emerald-400 uppercase">
            Quick drill · <span lang="ja">今日の漢字</span>
          </p>
          <h2
            id="kanji-preview-heading"
            className="mt-1 text-lg font-bold text-white"
          >
            Daily kanji
          </h2>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-950/50 px-2.5 py-1 text-xs font-black text-emerald-300">
          {pick.jlpt}
        </span>
      </div>

      <div aria-live="polite" className="relative mt-6">
        <div className={flipped ? "hidden" : "block"}>
          <div className="flex items-start gap-5">
            <Link
              href={kanjiHref(pick.character)}
              className="grid size-28 shrink-0 place-items-center rounded-2xl bg-white text-7xl font-black text-slate-950 shadow-lg transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
              aria-label={`View details for kanji ${pick.character}`}
            >
              <span lang="ja">{pick.character}</span>
            </Link>

            <div className="min-w-0 flex-1 pt-1">
              <p className="text-[11px] font-black tracking-[0.16em] text-slate-400 uppercase">
                Meaning
              </p>
              <p className="mt-1 text-xl leading-tight font-bold text-white">
                {pick.meanings.slice(0, 2).join(" · ")}
              </p>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-3">
                  <dt className="text-[11px] font-bold text-slate-400">
                    On&apos;yomi
                  </dt>
                  <dd lang="ja" className="mt-1 font-semibold text-emerald-300">
                    {pick.onyomi.join("、") || "—"}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-3">
                  <dt className="text-[11px] font-bold text-slate-400">
                    Kun&apos;yomi
                  </dt>
                  <dd lang="ja" className="mt-1 font-semibold text-emerald-300">
                    {pick.kunyomi.join("、") || "—"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={speak}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3.5 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              <span aria-hidden="true">{played ? "✓" : "▶"}</span>
              {played ? "Played" : `Hear ${pick.character}`}
            </button>
            <span className="text-xs font-semibold text-slate-400">
              {pick.strokes} strokes · browser voice (ja-JP)
            </span>
          </div>
        </div>

        <div className={flipped ? "block" : "hidden"}>
          <div className="rounded-2xl border border-slate-700/70 bg-slate-950/40 p-5">
            <p className="text-[11px] font-black tracking-[0.16em] text-emerald-400 uppercase">
              Example words
            </p>
            <ul className="mt-3 flex flex-col gap-3">
              {examples.map((example) => (
                <li
                  key={example.word}
                  className="flex items-baseline justify-between gap-3 border-b border-slate-800 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p lang="ja" className="text-lg font-bold text-white">
                      {example.word}
                    </p>
                    <p lang="ja" className="text-xs text-emerald-300">
                      {example.reading}
                    </p>
                  </div>
                  <p className="text-right text-sm text-slate-300">
                    {example.meaning}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              <span lang="ja">{pick.character}</span> · {pick.meanings.join(", ")}
            </p>
            <Link
              href={kanjiHref(pick.character)}
              className="mt-4 inline-flex text-sm font-bold text-emerald-400 underline-offset-4 hover:underline"
            >
              Open full kanji page →
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mt-6 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-5">
        <button
          type="button"
          onClick={() => setFlipped((value) => !value)}
          aria-pressed={flipped}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-3.5 py-2 text-sm font-bold text-slate-100 transition-colors hover:border-emerald-400 hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          <span aria-hidden="true">↻</span>
          {flipped ? "Flip to details" : "Flip to examples"}
        </button>
        <button
          type="button"
          onClick={nextKanji}
          className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold text-emerald-300 transition-colors hover:bg-slate-800/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          Next kanji <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
