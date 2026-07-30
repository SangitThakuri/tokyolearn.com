import Link from "next/link";
import type { LevelInfo } from "@/lib/types";

interface LevelCardProps {
  level: LevelInfo;
}

export default function LevelCard({ level }: LevelCardProps) {
  return (
    <Link
      href={`/${level.level}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
    >
      <div
        className={`h-2 bg-gradient-to-r ${level.gradient}`}
      />
      <div className="p-5">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          {level.label}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {level.description}
        </p>
        <div className="mt-4 flex gap-4 text-xs font-medium">
          {level.grammarCount > 0 && (
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {level.grammarCount} grammar
            </span>
          )}
          {level.vocabCount > 0 && (
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {level.vocabCount} vocab
            </span>
          )}
          {level.kanjiCount > 0 && (
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {level.kanjiCount} kanji
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
