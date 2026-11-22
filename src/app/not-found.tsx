import Link from "next/link";
import { LEVELS, levelHref } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col items-start gap-6 px-5 py-20 sm:px-8">
      <p className="text-sm font-bold tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400">
        404 · Page not found
      </p>
      <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
        This page wandered off.
      </h1>
      <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        The kanji or level you asked for isn&apos;t in our static dataset. Try a
        level hub below, or head back to the homepage.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          Back home
        </Link>
        {LEVELS.map((level) => (
          <Link
            key={level}
            href={levelHref(level)}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-800 hover:border-emerald-600 dark:border-slate-700 dark:text-slate-200"
          >
            {level}
          </Link>
        ))}
      </div>
    </main>
  );
}
