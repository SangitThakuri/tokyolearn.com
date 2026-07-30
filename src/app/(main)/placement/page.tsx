"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { levels } from "@/lib/levels";

type LevelId = "absolute-beginner" | "n5" | "n4" | "n3" | "n2" | "n1";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
  level: LevelId;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the hiragana for 'ka'?",
    options: ["か", "き", "く", "け"],
    answer: 0,
    level: "absolute-beginner",
  },
  {
    id: 2,
    question: "What does 食べる (たべる) mean?",
    options: ["To drink", "To eat", "To see", "To read"],
    answer: 1,
    level: "n5",
  },
  {
    id: 3,
    question: "Which particle marks the topic of a sentence?",
    options: ["が", "は", "を", "に"],
    answer: 1,
    level: "n5",
  },
  {
    id: 4,
    question: "What does 天気 (てんき) mean?",
    options: ["Weather", "Telephone", "Heaven", "Electricity"],
    answer: 0,
    level: "n4",
  },
  {
    id: 5,
    question: "What does 〜ている form express?",
    options: ["Past tense", "Progressive or state", "Negative", "Polite request"],
    answer: 1,
    level: "n4",
  },
  {
    id: 6,
    question: "What does 経験 (けいけん) mean?",
    options: ["Economy", "Experience", "Research", "Connection"],
    answer: 1,
    level: "n3",
  },
  {
    id: 7,
    question: "What does 〜ように express?",
    options: ["Must do", "In order to / so that", "Should have done", "Because"],
    answer: 1,
    level: "n3",
  },
  {
    id: 8,
    question: "What does 的確 (てきかく) mean?",
    options: ["Difficult", "Accurate / precise", "Enemy", "Suitable"],
    answer: 1,
    level: "n2",
  },
  {
    id: 9,
    question: "What does 〜に伴って (ともなって) express?",
    options: ["In spite of", "Along with / as", "Instead of", "Regardless of"],
    answer: 1,
    level: "n2",
  },
  {
    id: 10,
    question: "What nuance does 〜兼ねる (かねる) add?",
    options: ["Cannot / find it hard to", "Can do easily", "Does repeatedly", "Tries to do"],
    answer: 0,
    level: "n1",
  },
];

function mapScoreToLevel(score: number): LevelId {
  if (score <= 2) return "absolute-beginner";
  if (score <= 4) return "n5";
  if (score <= 6) return "n4";
  if (score <= 8) return "n3";
  if (score === 9) return "n2";
  return "n1";
}

const levelDescriptions: Record<LevelId, string> = {
  "absolute-beginner": "Start from the very beginning — learn hiragana, katakana, and basic greetings.",
  n5: "You have some foundation. Begin with N5 grammar, core vocabulary, and basic kanji.",
  n4: "You understand everyday Japanese. Build on N4 grammar and expand your vocabulary.",
  n3: "You handle intermediate concepts well. Focus on N3 nuance and broader vocabulary.",
  n2: "You're advanced. Refine with N2-level business and news-style Japanese.",
  n1: "You're near-native. Challenge yourself with N1 literary expressions and keigo.",
};

type Phase = "start" | "quiz" | "result";

export default function PlacementPage() {
  const [phase, setPhase] = useState<Phase>("start");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [storedLevel, setStoredLevel] = useState<LevelId | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tokyolearn-placement");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.level) setStoredLevel(parsed.level);
      } catch {}
    }
  }, []);

  function startQuiz() {
    setPhase("quiz");
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
  }

  function handleAnswer(index: number) {
    if (selected !== null) return;
    setSelected(index);
    if (index === questions[currentQ].answer) {
      setScore((s) => s + 1);
    }
  }

  function nextQuestion() {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
    } else {
      const resultLevel = mapScoreToLevel(score);
      localStorage.setItem(
        "tokyolearn-placement",
        JSON.stringify({ level: resultLevel }),
      );
      setPhase("result");
    }
  }

  const q = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;
  const isLast = currentQ === questions.length - 1;
  const resultLevel = mapScoreToLevel(score);
  const levelInfo = levels.find((l) => l.level === resultLevel);

  if (storedLevel && phase === "start") {
    const storedInfo = levels.find((l) => l.level === storedLevel);
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div
          className={`mx-auto mb-6 h-3 w-12 rounded-full ${storedInfo?.color ?? "bg-zinc-400"}`}
        />
        <h1 className="mb-2 text-2xl font-bold">You already took the quiz</h1>
        <p className="mb-1 text-zinc-600 dark:text-zinc-400">
          Your recommended level is{" "}
          <span className="font-semibold">{storedInfo?.label ?? storedLevel}</span>.
        </p>
        <p className="mb-8 text-sm text-zinc-500">{storedInfo?.description}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={`/${storedLevel}`}
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Go to my level
          </Link>
          <button
            onClick={startQuiz}
            className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Retake quiz
          </button>
        </div>
      </div>
    );
  }

  if (phase === "start") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto mb-6 h-3 w-12 rounded-full bg-zinc-900 dark:bg-white" />
        <h1 className="mb-3 text-3xl font-bold">Placement Quiz</h1>
        <p className="mb-2 text-zinc-600 dark:text-zinc-400">
          Answer 10 questions to find your ideal starting level.
        </p>
        <p className="mb-8 text-sm text-zinc-500">
          Covers kana, vocabulary, and grammar from beginner to advanced.
        </p>
        <button
          onClick={startQuiz}
          className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Start quiz
        </button>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        {levelInfo && (
          <div
            className={`mx-auto mb-6 h-3 w-12 rounded-full ${levelInfo.color}`}
          />
        )}
        <h1 className="mb-2 text-2xl font-bold">
          You scored {score} / {questions.length}
        </h1>
        <p className="mb-1 text-lg font-semibold">{levelInfo?.label}</p>
        <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          {levelDescriptions[resultLevel]}
        </p>
        <Link
          href={`/${resultLevel}`}
          className="inline-block rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Start {levelInfo?.label}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-zinc-500">
          <span>
            Question {currentQ + 1} of {questions.length}
          </span>
          <span>{q.level.replace("-", " ").toUpperCase()}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-zinc-900 transition-all duration-300 dark:bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="mb-6 text-xl font-semibold">{q.question}</h2>

      <div className="flex flex-col gap-3">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answer;
          const isSelected = i === selected;
          let className =
            "w-full rounded-lg border px-5 py-3 text-left text-sm transition-colors ";

          if (selected === null) {
            className +=
              "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800";
          } else if (isSelected && isCorrect) {
            className +=
              "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300";
          } else if (isSelected && !isCorrect) {
            className +=
              "border-red-400 bg-red-50 text-red-800 dark:border-red-400 dark:bg-red-950 dark:text-red-300";
          } else if (isCorrect) {
            className +=
              "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300";
          } else {
            className +=
              "border-zinc-200 bg-white opacity-50 dark:border-zinc-800 dark:bg-zinc-900";
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              className={className}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-6 text-center">
          <button
            onClick={nextQuestion}
            className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isLast ? "See results" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}
