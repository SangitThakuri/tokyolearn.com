import type { Metadata } from "next";
import { QuizEngine } from "@/components/study/QuizEngine";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "JLPT Quiz — Kanji Reading & Meaning Practice",
  description:
    "Take a 10, 20, or 50 question JLPT N5–N1 kanji quiz: kanji to reading, reading to kanji, or meaning to kanji. Track your streak and review missed items.",
  alternates: { canonical: absoluteUrl("/practice/quiz/") },
  openGraph: {
    title: "JLPT Quiz | TokyoLearn",
    description: "Adaptive-length kanji quizzes with instant review. No login required.",
    url: absoluteUrl("/practice/quiz/"),
  },
};

export default function QuizPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-bold tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400">
          Study tools · Quiz
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          JLPT kanji quiz
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
          Choose your level, question style, and length. Wrong answers are drawn
          from the same JLPT level, and missed items are reviewed at the end.
        </p>
      </header>

      <QuizEngine />
    </main>
  );
}
