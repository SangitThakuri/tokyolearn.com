"use client";

import { useState, useCallback, useMemo } from "react";
import type { Kana } from "@/lib/kanaData";

interface KanaTrainerProps {
  kanaList: Kana[];
  title: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function KanaTrainer({ kanaList, title }: KanaTrainerProps) {
  const [mode, setMode] = useState<"study" | "quiz">("study");
  const [current, setCurrent] = useState<Kana | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const total = correct + incorrect;

  const nextQuestion = useCallback(() => {
    const pick = kanaList[Math.floor(Math.random() * kanaList.length)];
    const distractors = shuffle(
      kanaList.filter((k) => k.romaji !== pick.romaji)
    )
      .slice(0, 3)
      .map((k) => k.romaji);
    const allOptions = shuffle([pick.romaji, ...distractors]);
    setCurrent(pick);
    setOptions(allOptions);
    setSelected(null);
    setFeedback(null);
  }, [kanaList]);

  const startQuiz = useCallback(() => {
    setCorrect(0);
    setIncorrect(0);
    setStreak(0);
    setBestStreak(0);
    setMode("quiz");
    nextQuestion();
  }, [nextQuestion]);

  const handleAnswer = useCallback(
    (romaji: string) => {
      if (feedback || !current) return;
      setSelected(romaji);
      if (romaji === current.romaji) {
        setFeedback("correct");
        setCorrect((c) => c + 1);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
      } else {
        setFeedback("incorrect");
        setIncorrect((c) => c + 1);
        setStreak(0);
      }
      setTimeout(() => nextQuestion(), 1000);
    },
    [feedback, current, nextQuestion]
  );

  const handleSkip = useCallback(() => {
    if (!current) return;
    setIncorrect((c) => c + 1);
    setStreak(0);
    nextQuestion();
  }, [current, nextQuestion]);

  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const grouped = useMemo(() => {
    const groups: Record<string, Kana[]> = {};
    for (const k of kanaList) {
      if (!groups[k.group]) groups[k.group] = [];
      groups[k.group].push(k);
    }
    return groups;
  }, [kanaList]);

  const groupLabels: Record<string, string> = {
    monograph: "Basic",
    dakuten: "Dakuten",
    handakuten: "Handakuten",
    yoon: "Yoon",
    "dakuten-yoon": "Dakuten + Yoon",
    "handakuten-yoon": "Handakuten + Yoon",
  };

  if (mode === "quiz") {
    return (
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setMode("study")}
            className="text-sm text-zinc-500 underline-offset-2 hover:underline dark:text-zinc-400"
          >
            &larr; Study Mode
          </button>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Streak: {streak}{bestStreak > 0 ? ` (best: ${bestStreak})` : ""}
          </span>
        </div>

        {current && (
          <div className="mb-8 text-center">
            <div className="mb-8 text-8xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {current.char}
            </div>

            <div className="mx-auto mb-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-zinc-900 transition-all duration-300 dark:bg-white"
                style={{ width: `${pct}%` }}
              />
            </div>

            <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              {correct} / {total} correct
            </p>

            <div className="grid grid-cols-2 gap-3">
              {options.map((romaji) => {
                let btnClass =
                  "rounded-xl border px-4 py-4 text-lg font-medium transition-all duration-200 ";
                if (feedback) {
                  if (romaji === current.romaji) {
                    btnClass +=
                      "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-300";
                  } else if (romaji === selected) {
                    btnClass +=
                      "border-red-400 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-950 dark:text-red-300";
                  } else {
                    btnClass +=
                      "border-zinc-200 bg-transparent text-zinc-400 dark:border-zinc-700 dark:text-zinc-500";
                  }
                } else {
                  btnClass +=
                    "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-800";
                }
                return (
                  <button
                    key={romaji}
                    onClick={() => handleAnswer(romaji)}
                    disabled={!!feedback}
                    className={btnClass}
                  >
                    {romaji}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSkip}
              disabled={!!feedback}
              className="mt-6 text-sm text-zinc-400 underline-offset-2 hover:text-zinc-600 hover:underline disabled:opacity-30 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              Skip
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <p className="mb-4 text-zinc-600 dark:text-zinc-400">
          Study the {title.toLowerCase()} characters below, then test yourself.
        </p>
        <button
          onClick={startQuiz}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Quiz Me
        </button>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([group, chars]) => (
          <section key={group}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {groupLabels[group] ?? group}
            </h3>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
              {chars.map((k) => (
                <div
                  key={k.char}
                  className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white px-2 py-3 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {k.char}
                  </span>
                  <span className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                    {k.romaji}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
