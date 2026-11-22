"use client";

import { useState } from "react";

interface PronounceButtonProps {
  text: string;
  label?: string;
  compact?: boolean;
}

export function PronounceButton({
  text,
  label = "Hear pronunciation",
  compact = false,
}: PronounceButtonProps) {
  const [playedText, setPlayedText] = useState("");
  const played = playedText === text;

  function speak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setPlayedText(text);
  }

  return (
    <button
      type="button"
      onClick={speak}
      title="Play Japanese pronunciation with your browser's speech synthesizer"
      className={
        compact
          ? "rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-800 transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
          : "inline-flex items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-800 dark:border-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500"
      }
    >
      <span aria-hidden="true">{played ? "✓" : "▶"}</span>
      {played ? "Played" : label}
    </button>
  );
}
