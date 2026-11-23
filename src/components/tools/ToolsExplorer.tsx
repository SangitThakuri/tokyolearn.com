"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  filterTools,
  TOOL_CATEGORIES,
  TOOLS,
  type ToolCategoryFilter,
} from "@/data/tools-catalog";

const FILTERS: readonly { value: ToolCategoryFilter; label: string }[] = [
  { value: "all", label: "All tools" },
  ...TOOL_CATEGORIES.map((category) => ({
    value: category.id,
    label: category.label,
  })),
];

export function ToolsExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ToolCategoryFilter>("all");

  const results = useMemo(() => filterTools(query, category), [query, category]);
  const counts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map((filter) => [
          filter.value,
          filterTools(query, filter.value).length,
        ]),
      ) as Record<ToolCategoryFilter, number>,
    [query],
  );

  return (
    <section aria-label="Tool library" className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900">
        <label htmlFor="tool-search" className="sr-only">
          Search tools
        </label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
          >
            ⌕
          </span>
          <input
            id="tool-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, skill, or keyword…"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pr-4 pl-10 text-base text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-2 focus:outline-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div
          role="tablist"
          aria-label="Tool categories"
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((filter) => {
            const active = category === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="tool-results"
                onClick={() => setCategory(filter.value)}
                className={`rounded-full border px-3.5 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                  active
                    ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-500 dark:bg-emerald-600"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                }`}
              >
                {filter.label}
                <span className="ml-2 text-xs opacity-70">{counts[filter.value]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="tool-results"
        role="tabpanel"
        aria-live="polite"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {results.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.path}
            className="group flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600"
          >
            <div className="flex items-start justify-between gap-3">
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-lg font-black text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              >
                {tool.icon}
              </span>
              {tool.badge ? (
                <span className="rounded-full bg-emerald-700 px-2.5 py-1 text-[10px] font-black tracking-wide text-white uppercase dark:bg-emerald-600">
                  {tool.badge}
                </span>
              ) : null}
            </div>

            <div>
              <h2 className="text-lg leading-snug font-bold text-slate-950 dark:text-white">
                {tool.title}
              </h2>
              <p
                lang="ja"
                className="mt-0.5 text-xs font-semibold text-slate-400 dark:text-slate-500"
              >
                {tool.jaTitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {tool.summary}
              </p>
            </div>

            <span className="mt-auto text-sm font-bold text-emerald-700 group-hover:underline dark:text-emerald-400">
              Open tool →
            </span>
          </Link>
        ))}
      </div>

      {results.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-base font-bold text-slate-900 dark:text-white">
            No tools match “{query}”.
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Try a level, “kanji”, “kana”, or “score”.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="mt-4 rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:border-emerald-600 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300"
          >
            Reset filters
          </button>
        </div>
      )}

      <p className="text-center text-xs text-slate-500 dark:text-slate-500">
        {results.length} of {TOOLS.length} tools shown · All tools run locally in
        your browser
      </p>
    </section>
  );
}
