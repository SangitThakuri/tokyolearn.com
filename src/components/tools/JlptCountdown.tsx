"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { jlptReference } from "@/data/reference-catalog";
import {
  formatWindow,
  splitDuration,
  upcomingExamWindows,
} from "@/lib/jlpt-dates";
import { LEVEL_META, LEVELS, levelHref, practiceHref } from "@/lib/site";
import type { JlptLevel } from "@/types/japanese";

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

/** Stable server snapshot avoids a hydration mismatch for time-dependent text. */
const SERVER_NOW = 0;
let clientNow = Date.now();

function subscribeToClock(onStoreChange: () => void): () => void {
  clientNow = Date.now();
  const interval = window.setInterval(() => {
    clientNow = Date.now();
    onStoreChange();
  }, 1000);
  return () => window.clearInterval(interval);
}

function getClientNow(): number {
  return clientNow;
}

function getServerNow(): number {
  return SERVER_NOW;
}

export function JlptCountdown() {
  const windows = useMemo(() => upcomingExamWindows(jlptReference.examWindows), []);
  const next = windows[0];
  const now = useSyncExternalStore(subscribeToClock, getClientNow, getServerNow);
  const [level, setLevel] = useState<JlptLevel>("N5");

  const remaining = next && now > 0 ? splitDuration((next.time - now) / 1000) : null;
  const meta = LEVEL_META[level];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="flex flex-col gap-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6 dark:border-slate-800 dark:bg-slate-950/50">
            <p className="text-[11px] font-black tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400">
              Next JLPT test window
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
              {next ? formatWindow(next) : "No upcoming date available"}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {next?.official
                ? "Official date published by the Japan Foundation / JEES"
                : "Estimated from the usual first-Sunday schedule"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 sm:p-6">
            {UNITS.map((unit) => (
              <div
                key={unit.key}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-950/60"
              >
                <p
                  role="timer"
                  aria-live="off"
                  className="text-3xl font-black tabular-nums text-slate-950 sm:text-4xl dark:text-white"
                >
                  {remaining ? remaining[unit.key] : "—"}
                </p>
                <p className="mt-1 text-[11px] font-black tracking-widest text-slate-500 uppercase dark:text-slate-400">
                  {unit.label}
                </p>
              </div>
            ))}
          </div>
          <p className="px-5 pb-5 text-center text-xs text-slate-500 sm:px-6 dark:text-slate-500">
            Countdown uses UTC midnight of the test date in your browser.
          </p>
        </div>

        <section aria-labelledby="windows-heading" className="flex flex-col gap-3">
          <h2 id="windows-heading" className="text-lg font-bold text-slate-950 dark:text-white">
            Upcoming windows
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {windows.map((window, index) => (
              <li
                key={window.iso}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {formatWindow(window)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {window.official ? "Official" : "Estimated"}
                  </p>
                </div>
                {index === 0 ? (
                  <span className="rounded-full bg-emerald-700 px-2.5 py-1 text-[10px] font-black tracking-wide text-white uppercase dark:bg-emerald-600">
                    Next
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </section>

      <aside className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase dark:text-slate-400">
            Quick level selector
          </h3>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {LEVELS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setLevel(value)}
                aria-pressed={level === value}
                className={`rounded-lg py-2 text-sm font-bold transition-colors ${
                  level === value
                    ? "bg-emerald-700 text-white dark:bg-emerald-600"
                    : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-emerald-950/40"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <div className={`mt-4 rounded-xl border p-4 ${meta.softAccent}`}>
            <p className={`text-xs font-black tracking-widest uppercase ${meta.accent}`}>
              Preparing for {level}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              {meta.label}
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {meta.description}
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href={levelHref(level)}
              className="rounded-lg bg-slate-900 px-3 py-2 text-center text-sm font-bold text-white hover:bg-emerald-700 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-400"
            >
              Study {level} →
            </Link>
            <Link
              href={practiceHref("quiz", level)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:text-emerald-400"
            >
              Take a {level} quiz
            </Link>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-500">
          Registration periods and test centres are announced separately. Always
          confirm your local date with the official JLPT site.
        </p>
      </aside>
    </div>
  );
}
