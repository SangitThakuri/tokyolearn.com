import type { Metadata } from "next";
import { KanaConverter } from "@/components/tools/KanaConverter";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Romaji ↔ Hiragana ↔ Katakana Converter",
  description:
    "Instantly convert between Romaji, Hiragana, and Katakana with one-click copy. Free, private, and runs in your browser.",
  alternates: { canonical: absoluteUrl("/tools/kana-converter/") },
  openGraph: {
    title: "Kana Converter | TokyoLearn",
    description: "Convert romaji, hiragana, and katakana instantly.",
    url: absoluteUrl("/tools/kana-converter/"),
  },
};

export default function KanaConverterPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-bold tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400">
          Tools · Kana converter
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          Kana converter
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
          Switch between Romaji, Hiragana, and Katakana as you type, then copy the
          result with one click. Conversion happens entirely in your browser.
        </p>
      </header>

      <KanaConverter />
    </main>
  );
}
