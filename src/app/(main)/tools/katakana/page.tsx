import type { Metadata } from "next";
import { katakana } from "@/lib/kanaData";
import KanaTrainer from "@/components/KanaTrainer";

export const metadata: Metadata = {
  title: "Katakana Trainer",
  description:
    "Study and quiz yourself on all katakana characters including dakuten, handakuten, and yoon.",
};

export default function KatakanaTrainerPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Katakana Trainer
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Master all 46 basic katakana plus dakuten, handakuten, and yoon.
        </p>
      </div>
      <KanaTrainer kanaList={katakana} title="Katakana" />
    </section>
  );
}
