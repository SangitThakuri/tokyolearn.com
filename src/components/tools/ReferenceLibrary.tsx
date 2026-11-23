"use client";

import { useMemo, useState } from "react";
import {
  referenceItemCount,
  topicReferenceDatasets,
} from "@/data/reference-catalog";

export function ReferenceLibrary() {
  const [datasetId, setDatasetId] = useState(
    topicReferenceDatasets[0]?.id ?? "",
  );
  const [query, setQuery] = useState("");

  const dataset = useMemo(
    () =>
      topicReferenceDatasets.find((item) => item.id === datasetId) ??
      topicReferenceDatasets[0],
    [datasetId],
  );

  const items = useMemo(() => {
    if (!dataset) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return dataset.items;
    return dataset.items.filter((item) =>
      [
        item.term.ja,
        item.term.en,
        item.reading ?? "",
        item.romaji ?? "",
        item.detail?.ja ?? "",
        item.detail?.en ?? "",
        ...(item.tags ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [dataset, query]);

  if (!dataset) return null;

  return (
    <section
      aria-labelledby="reference-library-heading"
      className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex flex-col gap-2">
        <p className="text-xs font-black tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400">
          Reference data
        </p>
        <h2 id="reference-library-heading" className="text-2xl font-black text-slate-950 dark:text-white">
          Quick topic reference
        </h2>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Curated vocabulary and grammar sets stored as versioned JSON. The same
          datasets power the score checker and exam countdown.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Reference topics"
        className="flex flex-wrap gap-2"
      >
        {topicReferenceDatasets.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === dataset.id}
            aria-controls="reference-items"
            onClick={() => {
              setDatasetId(item.id);
              setQuery("");
            }}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
              item.id === dataset.id
                ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-500 dark:bg-emerald-600"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:text-emerald-400"
            }`}
          >
            <span aria-hidden="true" lang="ja" className="text-base">
              {item.icon}
            </span>
            {item.title.en}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between dark:border-slate-800">
        <div>
          <h3 lang="ja" className="text-lg font-bold text-slate-950 dark:text-white">
            {dataset.title.ja}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {dataset.description.en}
          </p>
        </div>
        <label htmlFor="reference-search" className="sr-only">
          Filter this reference topic
        </label>
        <input
          id="reference-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter this topic…"
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-sm text-slate-950 focus:border-emerald-600 focus:outline-2 focus:outline-emerald-600 sm:w-56 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </div>

      <ul
        id="reference-items"
        role="tabpanel"
        aria-live="polite"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span lang="ja" className="text-2xl font-black text-slate-950 dark:text-white">
                {item.term.ja}
              </span>
              {item.reading ? (
                <span lang="ja" className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {item.reading}
                </span>
              ) : null}
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {item.term.en}
            </p>
            {item.detail ? (
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {item.detail.en}
              </p>
            ) : null}
            {item.fields?.map((field) => (
              <p key={field.label.en} className="text-xs text-slate-500 dark:text-slate-500">
                {field.label.en}: <span lang="ja" className="font-bold">{field.value.ja}</span>
                {" · "}
                {field.value.en}
              </p>
            ))}
            {item.examples?.[0] ? (
              <p lang="ja" className="mt-auto pt-1 text-xs text-slate-500 dark:text-slate-500">
                {item.examples[0].ja}
                {item.examples[0].reading ? `（${item.examples[0].reading}）` : ""}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
          No entries in this topic match “{query.trim()}”.
        </p>
      ) : null}

      <p className="text-center text-xs text-slate-500 dark:text-slate-500">
        {items.length} of {referenceItemCount(dataset)} entries shown
      </p>
    </section>
  );
}
