import type { Metadata } from "next";
import Link from "next/link";
import { examPapersByLevel } from "@/lib/exams.server";
import {
  LEVEL_META,
  absoluteUrl,
  examHref,
  examUrlPath,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "JLPT Past-Paper Style Exam Bank — TokyoLearn",
  description:
    "Original JLPT N5–N1 practice papers with vocabulary, grammar, reading, and listening questions. Bilingual explanations, no login required.",
  alternates: { canonical: absoluteUrl("/exams/") },
  openGraph: {
    title: "JLPT Past-Paper Style Exam Bank | TokyoLearn",
    description: "Timed-practice style papers with instant bilingual review.",
    url: absoluteUrl("/exams/"),
  },
};

export default function ExamsPage() {
  const groups = examPapersByLevel();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-bold tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400">
          <span lang="ja">過去問題集</span> · Practice exams
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          JLPT past-paper style exam bank
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
          Original exam-style papers for every level. Each paper covers 文字・語彙,
          文法, 読解, and optional 聴解, with bilingual explanations after you check
          your answers.
        </p>
      </header>

      <div className="flex flex-col gap-10">
        {groups.map(({ level, papers }) => {
          const meta = LEVEL_META[level];
          return (
            <section
              key={level}
              aria-labelledby={`exams-${level}-heading`}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <h2
                  id={`exams-${level}-heading`}
                  className="text-2xl font-black text-slate-950 dark:text-white"
                >
                  JLPT {level}
                </h2>
                <span className={`text-sm font-bold ${meta.accent}`}>
                  {meta.label}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {papers.length} {papers.length === 1 ? "paper" : "papers"}
                </span>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {papers.map((paper) => (
                  <li key={paper.id}>
                    <Link
                      href={examHref(paper.id)}
                      className="group flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                          {paper.session}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {paper.questions.length} questions
                        </span>
                      </div>
                      <h3 lang="ja" className="text-lg font-bold text-slate-950 dark:text-white">
                        {paper.title.ja}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {paper.description.en}
                      </p>
                      <span className="mt-auto pt-2 text-sm font-bold text-emerald-700 group-hover:underline dark:text-emerald-400">
                        Open paper →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        New files added to <code>data/exams/</code> become additional static
        papers automatically on the next deploy. See{" "}
        <Link
          href={examUrlPath("n5-sample-01")}
          className="font-bold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
        >
          the sample N5 paper
        </Link>{" "}
        to get started.
      </p>
    </main>
  );
}
