import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Japanese Learning Tools — TokyoLearn",
  description:
    "Browser-based Japanese study tools: analyze the JLPT kanji mix in any text and convert between romaji, hiragana, and katakana. No login required.",
  alternates: { canonical: absoluteUrl("/tools/") },
  openGraph: {
    title: "Japanese Learning Tools | TokyoLearn",
    description: "Text analysis and kana conversion, right in your browser.",
    url: absoluteUrl("/tools/"),
  },
};

const tools = [
  {
    href: "/tools/text-analyzer/",
    title: "Japanese text analyzer",
    description:
      "Paste Japanese text to count characters, scripts, and the estimated mix of N5–N1 kanji.",
    action: "Analyze text",
    icon: "文字",
  },
  {
    href: "/tools/kana-converter/",
    title: "Kana converter",
    description:
      "Instantly convert between Romaji, Hiragana, and Katakana, then copy the result in one click.",
    action: "Convert kana",
    icon: "かな",
  },
];

export default function ToolsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-bold tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400">
          TokyoLearn tools
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          Japanese study tools
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
          Small, fast utilities for reading and writing Japanese. Everything runs
          in your browser — no account, no uploads.
        </p>
      </header>

      <section aria-label="Available tools" className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500"
          >
            <span
              lang="ja"
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl font-black text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
            >
              {tool.icon}
            </span>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              {tool.title}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {tool.description}
            </p>
            <span className="mt-auto text-sm font-bold text-emerald-700 group-hover:underline dark:text-emerald-400">
              {tool.action} →
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
