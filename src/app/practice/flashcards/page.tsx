import type { Metadata } from "next";
import { FlashcardDeck } from "@/components/study/FlashcardDeck";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "JLPT Flashcards — Kanji & Vocabulary Drills",
  description:
    "Free flashcards for JLPT N5–N1 kanji and vocabulary. Flip cards with Space, grade with 1/2/3, hear Japanese pronunciation, and save progress in your browser.",
  alternates: { canonical: absoluteUrl("/practice/flashcards/") },
  openGraph: {
    title: "JLPT Flashcards | TokyoLearn",
    description: "Self-paced kanji and vocabulary flashcards. No login required.",
    url: absoluteUrl("/practice/flashcards/"),
  },
};

export default function FlashcardsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-bold tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400">
          Study tools · Flashcards
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          JLPT flashcards
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
          Pick a level and mode, then flip through the deck at your own pace.
          Ratings and progress are stored locally in this browser only.
        </p>
      </header>

      <FlashcardDeck />
    </main>
  );
}
