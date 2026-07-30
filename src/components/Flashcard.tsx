"use client";

import { useState } from "react";

interface FlashcardProps {
  front: string;
  back: string;
  onRate: (quality: number) => void;
}

const ratings = [
  { quality: 0, label: "Again", color: "bg-red-500 hover:bg-red-600" },
  { quality: 2, label: "Hard", color: "bg-orange-500 hover:bg-orange-600" },
  { quality: 3, label: "Good", color: "bg-emerald-500 hover:bg-emerald-600" },
  { quality: 5, label: "Easy", color: "bg-sky-500 hover:bg-sky-600" },
];

export default function Flashcard({ front, back, onRate }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-6">
      <div
        onClick={() => setFlipped(!flipped)}
        className="group w-full cursor-pointer"
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative h-64 w-full transition-all duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-700 dark:bg-zinc-900"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-center text-3xl font-bold text-zinc-900 dark:text-white">
              {front}
            </span>
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-700 dark:bg-zinc-900"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="text-center text-2xl font-semibold text-zinc-900 dark:text-white">
              {back}
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              tap card to flip back
            </span>
          </div>
        </div>
      </div>

      {flipped && (
        <div className="flex gap-2">
          {ratings.map((r) => (
            <button
              key={r.quality}
              onClick={() => {
                onRate(r.quality);
                setFlipped(false);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${r.color}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
