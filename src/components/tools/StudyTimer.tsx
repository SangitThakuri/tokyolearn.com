"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TimerMode = "focus" | "break";

interface TimerSettings {
  focusMinutes: number;
  breakMinutes: number;
  sessions: number;
}

const STORAGE_KEY = "tokyolearn:tools:study-timer:v1";
const DEFAULTS: TimerSettings = { focusMinutes: 25, breakMinutes: 5, sessions: 0 };

function clampMinutes(value: string, fallback: number, max: number): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(1, parsed));
}

function formatClock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function playChime() {
  if (typeof window === "undefined" || !window.AudioContext) return;
  try {
    const context = new window.AudioContext();
    [880, 660].forEach((frequency, index) => {
      const at = context.currentTime + index * 0.18;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.18, at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(at);
      oscillator.stop(at + 0.18);
    });
    window.setTimeout(() => void context.close(), 700);
  } catch {
    // Audio is a nice-to-have; the visual alert still fires.
  }
}

export function StudyTimer() {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<TimerMode>("focus");
  const [remaining, setRemaining] = useState(DEFAULTS.focusMinutes * 60);
  const [running, setRunning] = useState(false);
  const [flash, setFlash] = useState(false);
  const completing = useRef(false);
  const modeRef = useRef<TimerMode>(mode);
  const settingsRef = useRef<TimerSettings>(settings);
  const remainingRef = useRef(remaining);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<TimerSettings>;
          const restored: TimerSettings = {
            focusMinutes: clampMinutes(String(parsed.focusMinutes ?? 25), 25, 120),
            breakMinutes: clampMinutes(String(parsed.breakMinutes ?? 5), 5, 60),
            sessions:
              typeof parsed.sessions === "number" && parsed.sessions >= 0
                ? Math.floor(parsed.sessions)
                : 0,
          };
          settingsRef.current = restored;
          remainingRef.current = restored.focusMinutes * 60;
          setSettings(restored);
          setRemaining(restored.focusMinutes * 60);
        }
      } catch {
        // Invalid or blocked storage: keep the defaults.
      } finally {
        if (active) setHydrated(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Private mode or blocked storage: the timer still works this visit.
    }
  }, [settings, hydrated]);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      const next = Math.max(0, remainingRef.current - 1);
      remainingRef.current = next;
      setRemaining(next);

      if (next > 0 || completing.current) return;
      completing.current = true;
      setRunning(false);
      setFlash(true);
      playChime();

      const current = settingsRef.current;
      if (modeRef.current === "focus") {
        const updated = { ...current, sessions: current.sessions + 1 };
        settingsRef.current = updated;
        setSettings(updated);
        modeRef.current = "break";
        setMode("break");
        remainingRef.current = updated.breakMinutes * 60;
        setRemaining(remainingRef.current);
      } else {
        modeRef.current = "focus";
        setMode("focus");
        remainingRef.current = current.focusMinutes * 60;
        setRemaining(remainingRef.current);
      }

      window.setTimeout(() => {
        setFlash(false);
        completing.current = false;
      }, 1200);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  const duration = mode === "focus" ? settings.focusMinutes * 60 : settings.breakMinutes * 60;
  const progress = useMemo(
    () => Math.min(100, Math.max(0, ((duration - remaining) / duration) * 100)),
    [duration, remaining],
  );

  function switchMode(next: TimerMode) {
    completing.current = false;
    setRunning(false);
    setFlash(false);
    modeRef.current = next;
    setMode(next);
    remainingRef.current =
      next === "focus" ? settings.focusMinutes * 60 : settings.breakMinutes * 60;
    setRemaining(remainingRef.current);
  }

  function reset() {
    completing.current = false;
    setRunning(false);
    setFlash(false);
    remainingRef.current = duration;
    setRemaining(duration);
  }

  function updateMinutes(kind: "focus" | "break", value: string) {
    const minutes = clampMinutes(
      value,
      kind === "focus" ? settings.focusMinutes : settings.breakMinutes,
      kind === "focus" ? 120 : 60,
    );
    const updated: TimerSettings = {
      ...settingsRef.current,
      [kind === "focus" ? "focusMinutes" : "breakMinutes"]: minutes,
    };
    settingsRef.current = updated;
    setSettings(updated);
    if (modeRef.current === kind && !running) {
      remainingRef.current = minutes * 60;
      setRemaining(remainingRef.current);
    }
  }

  function clearSessions() {
    const updated = { ...settingsRef.current, sessions: 0 };
    settingsRef.current = updated;
    setSettings(updated);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section
        className={`flex flex-col items-center gap-6 rounded-2xl border bg-white p-6 shadow-sm transition-shadow sm:p-10 dark:bg-slate-900 ${
          flash
            ? "border-emerald-500 ring-4 ring-emerald-300/60 dark:ring-emerald-800/60"
            : "border-slate-200 dark:border-slate-800"
        }`}
      >
        <div className="flex flex-wrap justify-center gap-2">
          {(["focus", "break"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => switchMode(value)}
              aria-pressed={mode === value}
              className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition-colors ${
                mode === value
                  ? "bg-emerald-700 text-white dark:bg-emerald-600"
                  : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-emerald-950/40"
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs font-black tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-400">
            {mode === "focus" ? "Focus session" : "Break"}
          </p>
          <p
            role="timer"
            aria-live="off"
            className="mt-2 text-7xl font-black tracking-tight tabular-nums text-slate-950 sm:text-8xl dark:text-white"
          >
            {formatClock(remaining)}
          </p>
          <p aria-live="polite" className="mt-2 h-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
            {flash
              ? "Time’s up — take a breath!"
              : running
                ? "Running…"
                : remaining === duration
                  ? "Ready when you are"
                  : "Paused"}
          </p>
        </div>

        <div className="h-2 w-full max-w-md overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-600 transition-[width] duration-300 dark:bg-emerald-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              completing.current = false;
              setRunning((value) => !value);
            }}
            className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            {running ? "Pause" : remaining < duration ? "Resume" : "Start"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:border-emerald-600 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:text-emerald-400"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => switchMode(mode === "focus" ? "break" : "focus")}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:border-emerald-600 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:text-emerald-400"
          >
            Skip to {mode === "focus" ? "break" : "focus"}
          </button>
        </div>
      </section>

      <aside className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-black tracking-widest text-slate-500 uppercase dark:text-slate-400">
            Session lengths
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label htmlFor="focus-minutes" className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Focus
              </span>
              <div className="flex items-center gap-1">
                <input
                  id="focus-minutes"
                  type="number"
                  min={1}
                  max={120}
                  value={settings.focusMinutes}
                  onChange={(event) => updateMinutes("focus", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2 py-2 text-base font-bold text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                <span className="text-xs text-slate-500">min</span>
              </div>
            </label>
            <label htmlFor="break-minutes" className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Break
              </span>
              <div className="flex items-center gap-1">
                <input
                  id="break-minutes"
                  type="number"
                  min={1}
                  max={60}
                  value={settings.breakMinutes}
                  onChange={(event) => updateMinutes("break", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2 py-2 text-base font-bold text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                <span className="text-xs text-slate-500">min</span>
              </div>
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="text-xs font-black tracking-widest text-emerald-700 uppercase dark:text-emerald-400">
            Completed sessions
          </p>
          <p className="mt-1 text-5xl font-black tabular-nums text-slate-950 dark:text-white">
            {settings.sessions}
          </p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Saved locally in this browser.
          </p>
          <button
            type="button"
            onClick={clearSessions}
            disabled={settings.sessions === 0}
            className="mt-4 rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-bold text-emerald-800 disabled:opacity-50 dark:border-emerald-800 dark:text-emerald-300"
          >
            Clear count
          </button>
        </div>

        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-500">
          The alert uses a short Web Audio chime plus a visual flash. Your browser
          may require one interaction before audio can play.
        </p>
      </aside>
    </div>
  );
}
