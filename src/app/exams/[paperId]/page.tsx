import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExamSimulator } from "@/components/exams/ExamSimulator";
import { allExamPapers, getExamPaper } from "@/lib/exams.server";
import {
  LEVEL_META,
  absoluteUrl,
  examUrlPath,
  levelHref,
} from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return allExamPapers.map((paper) => ({ paperId: paper.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ paperId: string }>;
}): Promise<Metadata> {
  const { paperId } = await params;
  const paper = getExamPaper(paperId);
  if (!paper) return {};

  const url = absoluteUrl(examUrlPath(paper.id));
  const title = `${paper.title.en} — JLPT ${paper.level}`;
  const description = `${paper.description.en} ${paper.questions.length} original practice questions with bilingual explanations.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function ExamPaperPage({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  const { paperId } = await params;
  const paper = getExamPaper(paperId);
  if (!paper) notFound();

  const meta = LEVEL_META[paper.level];
  const listeningCount = paper.questions.filter(
    (question) => question.section === "listening",
  ).length;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-col gap-4">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Link href="/exams/" className="hover:text-emerald-700 dark:hover:text-emerald-400">
            Exam bank
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={levelHref(paper.level)}
            className="hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            JLPT {paper.level}
          </Link>
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-black tracking-widest ${meta.softAccent} ${meta.accent}`}
          >
            JLPT {paper.level}
          </span>
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            {paper.session}
          </span>
        </div>

        <h1 lang="ja" className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
          {paper.title.ja}
        </h1>
        <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
          {paper.description.en} Take all {paper.questions.length} questions in
          本番モード (Exam Mode) with a JLPT-paced countdown, or learn
          question-by-question in 練習モード (Practice Mode).
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sections: 文字・語彙 / 文法 / 読解
          {listeningCount > 0 ? " / 聴解" : ""} · Original practice content
        </p>
      </header>

      <ExamSimulator paper={paper} />
    </main>
  );
}
