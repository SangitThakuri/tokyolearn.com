"use client";

import type { JlptLevel } from "@/types/japanese";
import { LEVELS } from "@/lib/site";
import { setPracticeParams } from "@/lib/url-params";

interface LevelPickerProps {
  level: JlptLevel;
}

export function LevelPicker({ level }: LevelPickerProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="JLPT level">
      {LEVELS.map((item) => {
        const active = item === level;
        return (
          <button
            key={item}
            type="button"
            aria-pressed={active}
            onClick={() => setPracticeParams({ level: item })}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              active
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                : "border border-slate-300 text-slate-700 hover:border-emerald-600 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

interface ProgressBarProps {
  percent: number;
  label: string;
}

export function ProgressBar({ percent, label }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
    >
      <div
        className="h-full rounded-full bg-emerald-600 transition-[width] duration-500 dark:bg-emerald-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
