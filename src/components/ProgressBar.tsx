interface ProgressBarProps {
  value: number;
  max: number;
}

export default function ProgressBar({ value, max }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-zinc-900 transition-all duration-300 dark:bg-white"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="min-w-[3ch] text-right text-xs font-medium tabular-nums text-zinc-500 dark:text-zinc-400">
        {pct}%
      </span>
    </div>
  );
}
