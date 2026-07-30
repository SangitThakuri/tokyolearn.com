import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hiragana Chart — TokyoLearn",
  description: "Complete hiragana reference chart organized by row for Japanese learners.",
};

const rows = [
  { vowel: "a", chars: ["あ", "い", "う", "え", "お"] },
  { vowel: "k", chars: ["か", "き", "く", "け", "こ"] },
  { vowel: "s", chars: ["さ", "し", "す", "せ", "そ"] },
  { vowel: "t", chars: ["た", "ち", "つ", "て", "と"] },
  { vowel: "n", chars: ["な", "に", "ぬ", "ね", "の"] },
  { vowel: "h", chars: ["は", "ひ", "ふ", "へ", "ほ"] },
  { vowel: "m", chars: ["ま", "み", "む", "め", "も"] },
  { vowel: "y", chars: ["や", "", "ゆ", "", "よ"] },
  { vowel: "r", chars: ["ら", "り", "る", "れ", "ろ"] },
  { vowel: "w", chars: ["わ", "", "", "", "を"] },
];

const vowels = ["a", "i", "u", "e", "o"];

const dakuonRows = [
  { vowel: "g", chars: ["が", "ぎ", "ぐ", "げ", "ご"] },
  { vowel: "z", chars: ["ざ", "じ", "ず", "ぜ", "ぞ"] },
  { vowel: "d", chars: ["だ", "ぢ", "づ", "で", "ど"] },
  { vowel: "b", chars: ["ば", "び", "ぶ", "べ", "ぼ"] },
  { vowel: "p", chars: ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"] },
];

export default function HiraganaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-2 h-2 w-12 rounded-full bg-emerald-500" />
      <h1 className="mb-3 text-3xl font-bold">Hiragana Chart</h1>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400">
        Hiragana is the basic Japanese syllabary used for native Japanese words, grammatical
        particles, and verb endings. Master these characters to begin reading and writing Japanese.
      </p>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">Base Characters</h2>
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-center text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900">
                <th className="p-3 font-medium text-zinc-500" />
                {vowels.map((v) => (
                  <th key={v} className="p-3 font-medium text-zinc-500">
                    {v}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.vowel}
                  className="border-t border-zinc-200 dark:border-zinc-800"
                >
                  <td className="p-3 font-mono text-xs text-zinc-400">
                    {row.vowel}
                  </td>
                  {row.chars.map((c, i) => (
                    <td
                      key={i}
                      className={`p-3 text-xl ${c ? "" : "text-zinc-300 dark:text-zinc-700"}`}
                    >
                      {c || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">
          Dakuten & Handakuten
        </h2>
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-center text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900">
                <th className="p-3 font-medium text-zinc-500" />
                {vowels.map((v) => (
                  <th key={v} className="p-3 font-medium text-zinc-500">
                    {v}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dakuonRows.map((row) => (
                <tr
                  key={row.vowel}
                  className="border-t border-zinc-200 dark:border-zinc-800"
                >
                  <td className="p-3 font-mono text-xs text-zinc-400">
                    {row.vowel}
                  </td>
                  {row.chars.map((c, i) => (
                    <td
                      key={i}
                      className="p-3 text-xl"
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Youon (Contracted Sounds)</h2>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          Combinations like きゃ (kya), しゅ (shu), ちょ (cho) are formed by
          appending small や, ゆ, or よ to certain kana.
        </p>
      </section>

      <div className="mt-10 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
          Ready to practice? Use the hiragana trainer to drill recognition.
        </p>
        <Link
          href="/absolute-beginner/vocab"
          className="inline-block rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Open Hiragana Trainer
        </Link>
      </div>
    </div>
  );
}
