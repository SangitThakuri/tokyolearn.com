"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { examHref, LEVEL_META, LEVELS } from "@/lib/site";
import {
  getProgressSnapshot,
  getServerProgressSnapshot,
  subscribeProgress,
} from "@/lib/study-progress";
import type { JlptLevel } from "@/types/japanese";
import {
  EXAM_SECTION_FILTERS,
  EXAM_SECTION_LABELS,
  EXAM_SECTIONS,
  type ExamPaper,
  type ExamSectionFilter,
} from "@/types/exam";

type LevelFilter = "all" | JlptLevel;

const LEVEL_FILTERS: readonly { value: LevelFilter; label: string }[] = [
  { value: "all", label: "All levels" },
  ...LEVELS.map((level) => ({ value: level, label: `JLPT ${level}` })),
];

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-bold transition-colors ${
        active
          ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-500 dark:bg-emerald-600"
          : "border-slate-300 bg-white text-slate-700 hover:border-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

export function ExamsHub({ papers }: { papers: readonly ExamPaper[] }) {
  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getServerProgressSnapshot,
  );
  const [level, setLevel] = useState<LevelFilter>("all");
  const [section, setSection] = useState<ExamSectionFilter>("all");

  const filtered = useMemo(
    () =>
      papers.filter((paper) => {
        if (level !== "all" && paper.level !== level) return false;
        if (section === "all") return true;
        return paper.questions.some((question) => question.section === section);
      }),
    [papers, level, section],
  );

  const visibleLevels = useMemo(
    () =>
      LEVELS.filter((candidate) =>
        filtered.some((paper) => paper.level === candidate),
      ),
    [filtered],
  );

  const sectionLabel = EXAM_SECTION_FILTERS.find(
    (filter) => filter.value === section,
  )?.label;

  return (
    <div className="flex flex-col gap-8">
      <section
        aria-labelledby="exam-filters-heading"
        className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/70"
      >
        <h2
          id="exam-filters-heading"
          className="text-sm font-black tracking-wide text-slate-700 uppercase dark:text-slate-300"
        >
          Filters / 絞り込み
        </h2>

        <div className="mt-4 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              JLPT level
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by JLPT level">
              {LEVEL_FILTERS.map((filter) => (
                <FilterButton
                  key={filter.value}
                  active={level === filter.value}
                  onClick={() => setLevel(filter.value)}
                >
                  {filter.label}
                </FilterButton>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Section / 科目
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by exam section">
              {EXAM_SECTION_FILTERS.map((filter) => (
                <FilterButton
                  key={filter.value}
                  active={section === filter.value}
                  onClick={() => setSection(filter.value)}
                >
                  <span lang="ja">{filter.label.ja}</span>
                  <span className="ml-1 font-semibold">{filter.label.en}</span>
                </FilterButton>
              ))}
            </div>
            {section !== "all" && (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                選択した科目に焦点を当てた練習モードで開きます。 / Cards open in a
                section-focused practice run.
              </p>
            )}
          </div>
        </div>
      </section>

      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
        {filtered.length} {filtered.length === 1 ? "paper" : "papers"}
        {sectionLabel ? ` · ${sectionLabel.ja} / ${sectionLabel.en}` : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-600 dark:border-slate-700 dark:text-slate-400">
          No papers match these filters. Try another level or section.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {visibleLevels.map((candidate) => {
            const meta = LEVEL_META[candidate];
            const group = filtered.filter((paper) => paper.level === candidate);
            return (
              <section
                key={candidate}
                aria-labelledby={`hub-${candidate}-heading`}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2
                    id={`hub-${candidate}-heading`}
                    className="text-2xl font-black text-slate-950 dark:text-white"
                  >
                    JLPT {candidate}
                  </h2>
                  <span className={`text-sm font-bold ${meta.accent}`}>
                    {meta.label}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {group.length} {group.length === 1 ? "paper" : "papers"}
                  </span>
                </div>

                <ul className="grid gap-3 sm:grid-cols-2">
                  {group.map((paper) => {
                    const best = progress.exams.best[paper.id];
                    const attempts = progress.exams.attempts[paper.id] ?? 0;
                    const href =
                      section === "all"
                        ? examHref(paper.id)
                        : `${examHref(paper.id)}#section=${section}`;

                    return (
                      <li key={paper.id}>
                        <Link
                          href={href}
                          className="group flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                              {paper.session}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                              {paper.questions.length} questions
                            </span>
                            {attempts > 0 && (
                              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                · {attempts} {attempts === 1 ? "attempt" : "attempts"}
                              </span>
                            )}
                          </div>

                          <h3
                            lang="ja"
                            className="text-lg font-bold text-slate-950 dark:text-white"
                          >
                            {paper.title.ja}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {paper.description.en}
                          </p>

                          <ul className="flex flex-wrap gap-1.5" aria-label="Paper sections">
                            {EXAM_SECTIONS.map((candidateSection) => {
                              const count = paper.questions.filter(
                                (question) => question.section === candidateSection,
                              ).length;
                              if (count === 0) return null;
                              const isSelected = section === candidateSection;
                              return (
                                <li
                                  key={candidateSection}
                                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                    isSelected
                                      ? "bg-emerald-700 text-white dark:bg-emerald-600"
                                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                  }`}
                                >
                                  {EXAM_SECTION_LABELS[candidateSection].en} · {count}
                                </li>
                              );
                            })}
                          </ul>

                          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                            {best ? (
                              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                                <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                  ✓ 完了 Completed
                                </span>
                                <span className="text-slate-700 dark:text-slate-300">
                                  Best {best.percent}% · {best.correct}/{best.total}
                                </span>
                                {best.passed && (
                                  <span className="rounded-full bg-sky-100 px-2 py-1 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                                    Pass line met
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                Not started yet
                              </span>
                            )}
                            <span className="text-sm font-bold text-emerald-700 group-hover:underline dark:text-emerald-400">
                              {section === "all" ? "Open paper" : "Start section"} →
                            </span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
