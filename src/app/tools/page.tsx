import type { Metadata } from "next";
import { ReferenceLibrary } from "@/components/tools/ReferenceLibrary";
import { ToolsExplorer } from "@/components/tools/ToolsExplorer";
import { TOOL_CATEGORIES, TOOLS } from "@/data/tools-catalog";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Japanese Learning Tools — TokyoLearn",
  description:
    "Ten browser-based Japanese study tools: analyze text, highlight and search kanji, learn kana, check JLPT scores, and plan study sessions. No login required.",
  alternates: { canonical: absoluteUrl("/tools/") },
  openGraph: {
    title: "Japanese Learning Tools | TokyoLearn",
    description: "Kanji, kana, JLPT, and study tools that run right in your browser.",
    url: absoluteUrl("/tools/"),
  },
};

export default function ToolsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-col gap-4">
        <p className="text-sm font-bold tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400">
          TokyoLearn tools
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          Japanese study tools
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
          {TOOLS.length} small, fast utilities for reading and writing Japanese.
          Everything runs in your browser — no account, no uploads.
        </p>
        <div className="flex flex-wrap gap-2">
          {TOOL_CATEGORIES.map((category) => (
            <span
              key={category.id}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
            >
              <span aria-hidden="true" lang="ja" className="mr-1.5 text-emerald-700 dark:text-emerald-400">
                {category.icon}
              </span>
              {category.label}
            </span>
          ))}
        </div>
      </header>

      <ToolsExplorer />
      <ReferenceLibrary />
    </main>
  );
}
