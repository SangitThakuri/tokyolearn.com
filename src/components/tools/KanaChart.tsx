"use client";

import { useMemo, useState } from "react";
import { toKatakana } from "@/lib/kana";

type Script = "hiragana" | "katakana";
type ChartSection = "gojūon" | "dakuten" | "yōon";

interface KanaRow {
  label: string;
  cells: readonly string[];
  romaji: readonly string[];
}

interface ChartGroup {
  id: ChartSection;
  title: string;
  jaTitle: string;
  rows: readonly KanaRow[];
}

const CHART: readonly ChartGroup[] = [
  {
    id: "gojūon",
    title: "Gojūon",
    jaTitle: "五十音",
    rows: [
      { label: "あ行", cells: ["あ", "い", "う", "え", "お"], romaji: ["a", "i", "u", "e", "o"] },
      { label: "か行", cells: ["か", "き", "く", "け", "こ"], romaji: ["ka", "ki", "ku", "ke", "ko"] },
      { label: "さ行", cells: ["さ", "し", "す", "せ", "そ"], romaji: ["sa", "shi", "su", "se", "so"] },
      { label: "た行", cells: ["た", "ち", "つ", "て", "と"], romaji: ["ta", "chi", "tsu", "te", "to"] },
      { label: "な行", cells: ["な", "に", "ぬ", "ね", "の"], romaji: ["na", "ni", "nu", "ne", "no"] },
      { label: "は行", cells: ["は", "ひ", "ふ", "へ", "ほ"], romaji: ["ha", "hi", "fu", "he", "ho"] },
      { label: "ま行", cells: ["ま", "み", "む", "め", "も"], romaji: ["ma", "mi", "mu", "me", "mo"] },
      { label: "や行", cells: ["や", "", "ゆ", "", "よ"], romaji: ["ya", "", "yu", "", "yo"] },
      { label: "ら行", cells: ["ら", "り", "る", "れ", "ろ"], romaji: ["ra", "ri", "ru", "re", "ro"] },
      { label: "わ行", cells: ["わ", "", "", "", "を"], romaji: ["wa", "", "", "", "wo"] },
      { label: "ん", cells: ["ん"], romaji: ["n"] },
    ],
  },
  {
    id: "dakuten",
    title: "Dakuten & handakuten",
    jaTitle: "濁点・半濁点",
    rows: [
      { label: "が行", cells: ["が", "ぎ", "ぐ", "げ", "ご"], romaji: ["ga", "gi", "gu", "ge", "go"] },
      { label: "ざ行", cells: ["ざ", "じ", "ず", "ぜ", "ぞ"], romaji: ["za", "ji", "zu", "ze", "zo"] },
      { label: "だ行", cells: ["だ", "ぢ", "づ", "で", "ど"], romaji: ["da", "ji", "zu", "de", "do"] },
      { label: "ば行", cells: ["ば", "び", "ぶ", "べ", "ぼ"], romaji: ["ba", "bi", "bu", "be", "bo"] },
      { label: "ぱ行", cells: ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"], romaji: ["pa", "pi", "pu", "pe", "po"] },
    ],
  },
  {
    id: "yōon",
    title: "Yōon",
    jaTitle: "拗音",
    rows: [
      { label: "きゃ行", cells: ["きゃ", "きゅ", "きょ"], romaji: ["kya", "kyu", "kyo"] },
      { label: "しゃ行", cells: ["しゃ", "しゅ", "しょ"], romaji: ["sha", "shu", "sho"] },
      { label: "ちゃ行", cells: ["ちゃ", "ちゅ", "ちょ"], romaji: ["cha", "chu", "cho"] },
      { label: "にゃ行", cells: ["にゃ", "にゅ", "にょ"], romaji: ["nya", "nyu", "nyo"] },
      { label: "ひゃ行", cells: ["ひゃ", "ひゅ", "ひょ"], romaji: ["hya", "hyu", "hyo"] },
      { label: "みゃ行", cells: ["みゃ", "みゅ", "みょ"], romaji: ["mya", "myu", "myo"] },
      { label: "りゃ行", cells: ["りゃ", "りゅ", "りょ"], romaji: ["rya", "ryu", "ryo"] },
      { label: "ぎゃ行", cells: ["ぎゃ", "ぎゅ", "ぎょ"], romaji: ["gya", "gyu", "gyo"] },
      { label: "じゃ行", cells: ["じゃ", "じゅ", "じょ"], romaji: ["ja", "ju", "jo"] },
      { label: "びゃ行", cells: ["びゃ", "びゅ", "びょ"], romaji: ["bya", "byu", "byo"] },
      { label: "ぴゃ行", cells: ["ぴゃ", "ぴゅ", "ぴょ"], romaji: ["pya", "pyu", "pyo"] },
    ],
  },
];

const SECTION_FILTERS: readonly { value: ChartSection | "all"; label: string }[] = [
  { value: "all", label: "All charts" },
  { value: "gojūon", label: "Gojūon" },
  { value: "dakuten", label: "Dakuten" },
  { value: "yōon", label: "Yōon" },
];

export function KanaChart() {
  const [script, setScript] = useState<Script>("hiragana");
  const [section, setSection] = useState<ChartSection | "all">("all");
  const [playing, setPlaying] = useState("");

  const groups = useMemo(
    () => CHART.filter((group) => section === "all" || group.id === section),
    [section],
  );

  function speak(kana: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(kana);
    utterance.lang = "ja-JP";
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setPlaying(kana);
    window.setTimeout(() => setPlaying((current) => (current === kana ? "" : current)), 900);
  }

  return (
    <div className="flex flex-col gap-8">
      <section
        aria-label="Chart controls"
        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
            Script
          </span>
          {(["hiragana", "katakana"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setScript(value)}
              aria-pressed={script === value}
              className={`rounded-lg border px-3 py-1.5 text-sm font-bold capitalize transition-colors ${
                script === value
                  ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-500 dark:bg-emerald-600"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
            Chart
          </span>
          {SECTION_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setSection(filter.value)}
              aria-pressed={section === filter.value}
              className={`rounded-full border px-3 py-1.5 text-sm font-bold transition-colors ${
                section === filter.value
                  ? "border-emerald-700 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Tap a character to hear it with your browser’s Japanese voice (ja-JP).
        </p>
      </section>

      <div className="flex flex-col gap-8 print:gap-4">
        {groups.map((group) => (
          <section
            key={group.id}
            aria-labelledby={`kana-${group.id}`}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:border-black print:shadow-none dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-950/50">
              <h2 id={`kana-${group.id}`} className="text-lg font-bold text-slate-950 dark:text-white">
                {group.title}
              </h2>
              <p lang="ja" className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {group.jaTitle}
              </p>
            </div>
            <div className="overflow-x-auto p-3 sm:p-5 print:overflow-visible print:p-2">
              <table className="w-full min-w-[420px] border-collapse text-center print:min-w-0">
                <tbody>
                  {group.rows.map((row) => (
                    <tr key={row.label}>
                      <th
                        scope="row"
                        className="w-16 border border-slate-100 px-2 py-2 text-xs font-black text-slate-500 print:border-black dark:border-slate-800 dark:text-slate-400"
                      >
                        {row.label}
                      </th>
                      {row.cells.map((cell, index) => {
                        const kana =
                          script === "katakana" ? toKatakana(cell) : cell;
                        const romaji = row.romaji[index];
                        if (!cell) {
                          return (
                            <td
                              key={`${row.label}-${index}`}
                              aria-hidden="true"
                              className="border border-slate-100 px-1 py-1 print:border-black dark:border-slate-800"
                            />
                          );
                        }
                        return (
                          <td
                            key={`${row.label}-${kana}`}
                            className="border border-slate-100 p-1 print:border-black dark:border-slate-800"
                          >
                            <button
                              type="button"
                              onClick={() => speak(kana)}
                              title={`Hear ${kana}`}
                              className={`flex w-full flex-col items-center rounded-lg px-1 py-2 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-600 print:hover:bg-transparent dark:hover:bg-emerald-950/40 ${
                                playing === kana ? "bg-emerald-100 dark:bg-emerald-950/60" : ""
                              }`}
                            >
                              <span lang="ja" className="text-2xl leading-none font-bold text-slate-950 dark:text-white">
                                {kana}
                              </span>
                              <span className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                {romaji}
                              </span>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <p className="text-center text-xs text-slate-500 print:hidden dark:text-slate-500">
        Print with your browser’s print dialog for a clean black-and-white kana
        reference sheet.
      </p>
    </div>
  );
}
