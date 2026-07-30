import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katakana Chart — TokyoLearn",
  description: "Complete katakana reference chart organized by row for Japanese learners.",
};

const rows = [
  { vowel: "a", chars: ["ア", "イ", "ウ", "エ", "オ"] },
  { vowel: "k", chars: ["カ", "キ", "ク", "ケ", "コ"] },
  { vowel: "s", chars: ["サ", "シ", "ス", "セ", "ソ"] },
  { vowel: "t", chars: ["タ", "チ", "ツ", "テ", "ト"] },
  { vowel: "n", chars: ["ナ", "ニ", "ヌ", "ネ", "ノ"] },
  { vowel: "h", chars: ["ハ", "ヒ", "フ", "ヘ", "ホ"] },
  { vowel: "m", chars: ["マ", "ミ", "ム", "メ", "モ"] },
  { vowel: "y", chars: ["ヤ", "", "ユ", "", "ヨ"] },
  { vowel: "r", chars: ["ラ", "リ", "ル", "レ", "ロ"] },
  { vowel: "w", chars: ["ワ", "", "", "", "ヲ"] },
];

const vowels = ["a", "i", "u", "e", "o"];

const dakuonRows = [
  { vowel: "g", chars: ["ガ", "ギ", "グ", "ゲ", "ゴ"] },
  { vowel: "z", chars: ["ザ", "ジ", "ズ", "ゼ", "ゾ"] },
  { vowel: "d", chars: ["ダ", "ヂ", "ヅ", "デ", "ド"] },
  { vowel: "b", chars: ["バ", "ビ", "ブ", "ベ", "ボ"] },
  { vowel: "p", chars: ["パ", "ピ", "プ", "ペ", "ポ"] },
];

export default function KatakanaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-2 h-2 w-12 rounded-full bg-emerald-500" />
      <h1 className="mb-3 text-3xl font-bold">Katakana Chart</h1>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400">
        Katakana is used for loanwords (外来語 / gairaigo), foreign names, onomatopoeia, and
        emphasis — similar to italics in English. It follows the same syllabic structure as
        hiragana.
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

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">Common Katakana Words</h2>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          Katakana is everywhere in modern Japanese. Look for these loanwords in menus, stores,
          and media: コーヒー (coffee), コンピュータ (computer), タクシー (taxi), ホテル (hotel).
        </p>
      </section>

      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
          Ready to practice? Use the katakana trainer to drill recognition.
        </p>
        <Link
          href="/absolute-beginner/vocab"
          className="inline-block rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Open Katakana Trainer
        </Link>
      </div>
    </div>
  );
}
