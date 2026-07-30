import Link from "next/link";
import LevelCard from "@/components/LevelCard";
import { levels } from "@/lib/levels";

const features = [
  {
    title: "Hiragana & Katakana Trainer",
    desc: "Master the Japanese syllabaries with stroke-order guides and drills.",
    href: "/absolute-beginner",
  },
  {
    title: "Grammar Library",
    desc: "Structured JLPT-graded grammar points with formation, usage, and examples.",
    href: "/n5/grammar",
  },
  {
    title: "SRS Flashcards",
    desc: "Spaced repetition vocabulary and kanji deck to lock in long-term memory.",
    href: "/n5/vocab",
  },
  {
    title: "Full-Text Search",
    desc: "Instantly search across grammar, vocabulary, and kanji by keyword.",
    href: "/search",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 py-24 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Master Japanese,{" "}
          <span className="text-blue-600 dark:text-blue-400">one step at a time</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          From hiragana to JLPT N1 and beyond — TokyoLearn offers structured
          lessons, vocabulary, kanji, and reading practice for every level.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/absolute-beginner"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Start Learning
          </Link>
          <Link
            href="/placement"
            className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Take Placement Quiz
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {levels.map((level) => (
            <LevelCard key={level.level} level={level} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24">
        <h2 className="mb-8 text-2xl font-bold">What you&apos;ll find</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="rounded-xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <h3 className="mb-2 font-semibold">{f.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
