import type { Metadata } from "next";
import Link from "next/link";
import { ExamsHub } from "@/components/exams/ExamsHub";
import { allExamPapers } from "@/lib/exams.server";
import { absoluteUrl, examUrlPath } from "@/lib/site";

export const metadata: Metadata = {
  title: "過去問題集 | JLPT Past-Style Practice Exams — TokyoLearn",
  description:
    "Original JLPT N5–N1 past-paper-style exams with timed exam mode, instant practice feedback, section accuracy, and bilingual explanations. No login required.",
  alternates: { canonical: absoluteUrl("/exams/") },
  openGraph: {
    title: "過去問題集 | JLPT Past-Style Practice Exams | TokyoLearn",
    description:
      "Timed JLPT practice with answer review and local best scores.",
    url: absoluteUrl("/exams/"),
  },
};

export default function ExamsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-bold tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400">
          <span lang="ja">過去問題集</span> · Practice exams
        </p>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          <span lang="ja">過去問題集</span>{" "}
          <span className="text-slate-400 dark:text-slate-600">|</span>{" "}
          JLPT Past-Style Practice Exams
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
          Take each paper in 本番モード (Exam Mode) with JLPT-paced timing, or
          learn question-by-question in 練習モード (Practice Mode). Best scores
          and completion badges are saved in your browser only.
        </p>
      </header>

      <ExamsHub papers={allExamPapers} />

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
