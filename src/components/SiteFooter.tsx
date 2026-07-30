import Link from "next/link";
import { levels } from "@/lib/levels";

const toolLinks = [
  { label: "Hiragana Trainer", href: "/tools/hiragana" },
  { label: "Katakana Trainer", href: "/tools/katakana" },
  { label: "Flashcards", href: "/tools/flashcards" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white"
            >
              TokyoLearn
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              Master Japanese from absolute beginner to native-level fluency.
              Free JLPT study with grammar, vocabulary, kanji, and reading
              practice.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
              Levels
            </h3>
            <ul className="mt-3 space-y-2">
              {levels.map((l) => (
                <li key={l.level}>
                  <Link
                    href={`/${l.level}`}
                    className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
              Tools
            </h3>
            <ul className="mt-3 space-y-2">
              {toolLinks.map((t) => (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} TokyoLearn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
