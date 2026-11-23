/** Upcoming JLPT test-window helpers derived from the reference dataset. */

import type { ExamWindowSeed } from "@/types/reference";

export interface JlptExamWindow {
  year: number;
  month: 7 | 12;
  day: number;
  /** UTC midnight of the test day, used only for the countdown. */
  time: number;
  iso: string;
  official: boolean;
}

function firstSunday(year: number, month: 7 | 12): number {
  const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  return 1 + ((7 - firstDay) % 7);
}

function startOfUtcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

/**
 * 2026 dates are official; later windows use the JLPT's usual first-Sunday
 * pattern and are clearly labelled as estimates in the UI until announced.
 */
export function upcomingExamWindows(
  seeds: readonly ExamWindowSeed[],
  now: Date = new Date(),
  count = 4,
): JlptExamWindow[] {
  const today = startOfUtcDay(now);
  const windows: JlptExamWindow[] = [];

  for (let year = now.getUTCFullYear(); year <= now.getUTCFullYear() + 2; year++) {
    for (const month of [7, 12] as const) {
      const seed = seeds.find((item) => item.year === year && item.month === month);
      const day = seed?.day ?? firstSunday(year, month);
      const time = Date.UTC(year, month - 1, day);
      if (time < today) continue;
      windows.push({
        year,
        month,
        day,
        time,
        iso: new Date(time).toISOString().slice(0, 10),
        official: seed?.official ?? false,
      });
    }
  }

  return windows.sort((a, b) => a.time - b.time).slice(0, count);
}

export function formatWindow(window: JlptExamWindow): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(window.time));
}

export function splitDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  return {
    days: Math.floor(seconds / 86_400),
    hours: Math.floor((seconds % 86_400) / 3_600),
    minutes: Math.floor((seconds % 3_600) / 60),
    seconds: seconds % 60,
  };
}
