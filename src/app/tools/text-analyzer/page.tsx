import type { Metadata } from "next";
import { TextAnalyzer } from "@/components/tools/TextAnalyzer";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Japanese Text Analyzer — Count Kanji & JLPT Levels",
  description:
    "Paste any Japanese text to count total, kanji, hiragana, and katakana characters and estimate its N5–N1 JLPT kanji distribution.",
  alternates: { canonical: absoluteUrl("/tools/text-analyzer/") },
  openGraph: {
    title: "Japanese Text Analyzer | TokyoLearn",
    description: "See the script mix and JLPT kanji level of any Japanese text.",
    url: absoluteUrl("/tools/text-analyzer/"),
  },
};

export default function TextAnalyzerPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-bold tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400">
          Tools · Text analyzer
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          Japanese text analyzer
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
          Paste Japanese text to count characters by script and see which JLPT
          levels its kanji come from. Nothing is uploaded or stored.
        </p>
      </header>

      <TextAnalyzer />
    </main>
  );
}
