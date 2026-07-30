import Link from "next/link";

const tools = [
  {
    emoji: "あ",
    title: "Hiragana Trainer",
    desc: "Practice hiragana characters with flashcards and quizzes",
    href: "/tools/hiragana",
  },
  {
    emoji: "ア",
    title: "Katakana Trainer",
    desc: "Practice katakana characters with flashcards and quizzes",
    href: "/tools/katakana",
  },
  {
    emoji: "🗃️",
    title: "Flashcards",
    desc: "Spaced repetition SRS flashcards for vocabulary, kanji, and grammar",
    href: "/tools/flashcards",
  },
  {
    emoji: "📝",
    title: "Placement Quiz",
    desc: "Find your current Japanese level (coming soon)",
    href: "#",
    disabled: true,
  },
  {
    emoji: "📊",
    title: "Progress Dashboard",
    desc: "Track your study stats and achievements (coming soon)",
    href: "#",
    disabled: true,
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Tools</h1>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400">
        Supplementary study tools to accelerate your Japanese learning.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((t) =>
          t.disabled ? (
            <div
              key={t.title}
              className="cursor-not-allowed rounded-xl border border-zinc-200 bg-white p-6 opacity-50 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-3 text-2xl">{t.emoji}</div>
              <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">{t.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.desc}</p>
            </div>
          ) : (
            <Link
              key={t.title}
              href={t.href}
              className="rounded-xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="mb-3 text-2xl">{t.emoji}</div>
              <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">{t.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.desc}</p>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
