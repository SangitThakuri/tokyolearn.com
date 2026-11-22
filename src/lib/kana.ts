/** Self-contained Hepburn-style romaji ⇄ kana conversion (no runtime deps). */

export type Script = "romaji" | "hiragana" | "katakana";

const HIRAGANA_START = 0x3041;
const HIRAGANA_END = 0x3096;
const KATAKANA_OFFSET = 0x60;
const VOWELS = "aiueo";

const VOWEL_KANA: Record<string, string> = {
  a: "あ", i: "い", u: "う", e: "え", o: "お",
};

const KANA_TABLE: Record<string, Record<string, string>> = {
  k: { a: "か", i: "き", u: "く", e: "け", o: "こ" },
  g: { a: "が", i: "ぎ", u: "ぐ", e: "げ", o: "ご" },
  s: { a: "さ", i: "し", u: "す", e: "せ", o: "そ" },
  z: { a: "ざ", i: "じ", u: "ず", e: "ぜ", o: "ぞ" },
  t: { a: "た", i: "ち", u: "つ", e: "て", o: "と" },
  d: { a: "だ", i: "ぢ", u: "づ", e: "で", o: "ど" },
  n: { a: "な", i: "に", u: "ぬ", e: "ね", o: "の" },
  h: { a: "は", i: "ひ", u: "ふ", e: "へ", o: "ほ" },
  b: { a: "ば", i: "び", u: "ぶ", e: "べ", o: "ぼ" },
  p: { a: "ぱ", i: "ぴ", u: "ぷ", e: "ぺ", o: "ぽ" },
  m: { a: "ま", i: "み", u: "む", e: "め", o: "も" },
  y: { a: "や", u: "ゆ", o: "よ" },
  r: { a: "ら", i: "り", u: "る", e: "れ", o: "ろ" },
  w: { a: "わ", o: "を" },
  f: { u: "ふ" },
  v: { u: "ゔ" },
  j: { i: "じ" },
};

const SMALL_Y: Record<string, string> = {
  a: "ゃ", i: "ぃ", u: "ゅ", e: "ぇ", o: "ょ",
};

const MACRONS: Record<string, string> = {
  ā: "aa", ī: "ii", ū: "uu", ē: "ee", ō: "ou",
  Ā: "AA", Ī: "II", Ū: "UU", Ē: "EE", Ō: "OU",
};

/** Common greetings whose conventional kana differs from a literal mapping. */
const PHRASES: Record<string, string> = {
  konnichiwa: "こんにちは",
  konbanwa: "こんばんは",
  ohayou: "おはよう",
  arigatou: "ありがとう",
  arigato: "ありがとう",
  sumimasen: "すみません",
  sayonara: "さようなら",
  hajimemashite: "はじめまして",
};

function shiftKana(text: string, toKatakanaForm: boolean): string {
  return text.normalize("NFKC").replace(/[\u3041-\u3096\u30A1-\u30F6]/g, (char) => {
    const code = char.codePointAt(0) ?? 0;
    const isHiragana = code >= HIRAGANA_START && code <= HIRAGANA_END;
    if (isHiragana === toKatakanaForm) {
      return String.fromCodePoint(code + (toKatakanaForm ? KATAKANA_OFFSET : -KATAKANA_OFFSET));
    }
    return char;
  });
}

export function toHiragana(text: string): string {
  return shiftKana(text, false);
}

export function toKatakana(text: string): string {
  return shiftKana(text, true);
}

const KANA_TO_ROMAJI: Record<string, string> = {
  "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o",
  "か": "ka", "き": "ki", "く": "ku", "け": "ke", "こ": "ko",
  "が": "ga", "ぎ": "gi", "ぐ": "gu", "げ": "ge", "ご": "go",
  "さ": "sa", "し": "shi", "す": "su", "せ": "se", "そ": "so",
  "ざ": "za", "じ": "ji", "ず": "zu", "ぜ": "ze", "ぞ": "zo",
  "た": "ta", "ち": "chi", "つ": "tsu", "て": "te", "と": "to",
  "だ": "da", "ぢ": "ji", "づ": "zu", "で": "de", "ど": "do",
  "な": "na", "に": "ni", "ぬ": "nu", "ね": "ne", "の": "no",
  "は": "ha", "ひ": "hi", "ふ": "fu", "へ": "he", "ほ": "ho",
  "ば": "ba", "び": "bi", "ぶ": "bu", "べ": "be", "ぼ": "bo",
  "ぱ": "pa", "ぴ": "pi", "ぷ": "pu", "ぺ": "pe", "ぽ": "po",
  "ま": "ma", "み": "mi", "む": "mu", "め": "me", "も": "mo",
  "や": "ya", "ゆ": "yu", "よ": "yo",
  "ら": "ra", "り": "ri", "る": "ru", "れ": "re", "ろ": "ro",
  "わ": "wa", "を": "wo", "ん": "n", "ゔ": "vu",
  "っ": "", "ー": "",
};

const SMALL_Y_ROMAJI: Record<string, string> = {
  "ゃ": "ya", "ゅ": "yu", "ょ": "yo",
};

const SMALL_VOWEL_ROMAJI: Record<string, string> = {
  "ぁ": "a", "ぃ": "i", "ぅ": "u", "ぇ": "e", "ぉ": "o",
};

const PUNCTUATION: Record<string, string> = {
  "、": ", ", "。": ". ", "？": "? ", "！": "! ", "・": " ",
};

/** Append a small-ya kana using Hepburn digraphs (sha, cha, ja, kya, …). */
function appendSmallYa(output: string, char: string): string {
  const vowel = char === "ゃ" ? "a" : char === "ゅ" ? "u" : "o";
  const digraph = output.match(/(shi|chi|ji)$/);
  if (digraph) {
    const base = digraph[0] === "shi" ? "sh" : digraph[0] === "chi" ? "ch" : "j";
    return output.slice(0, -digraph[0].length) + base + vowel;
  }
  if (output.endsWith("i")) return output.slice(0, -1) + "y" + vowel;
  return output + SMALL_Y_ROMAJI[char];
}

export function toRomaji(input: string): string {
  const text = toHiragana(input);
  let output = "";

  for (let index = 0; index < text.length; index++) {
    const char = text[index];

    if (char === "っ") {
      const following = KANA_TO_ROMAJI[text[index + 1]];
      output += following ? following[0] : "'";
      continue;
    }

    if (char === "ー") {
      const lastVowel = [...output].reverse().find((value) => VOWELS.includes(value));
      output += lastVowel ?? "-";
      continue;
    }

    if (SMALL_Y_ROMAJI[char]) {
      output = appendSmallYa(output, char);
      continue;
    }

    if (SMALL_VOWEL_ROMAJI[char]) {
      output = output.replace(/[aeiou]$/, "");
      output += SMALL_VOWEL_ROMAJI[char];
      continue;
    }

    const romaji = KANA_TO_ROMAJI[char];
    if (romaji !== undefined) {
      if (output.endsWith("n") && /^[aiueoy]/.test(romaji)) output += "'";
      // は/へ are pronounced wa/e as sentence-ending particles.
      const next = text[index + 1];
      const atClauseEnd = !next || PUNCTUATION[next] !== undefined;
      output += atClauseEnd && char === "は" ? "wa" : atClauseEnd && char === "へ" ? "e" : romaji;
      continue;
    }

    output += PUNCTUATION[char] ?? char;
  }

  return output.trim();
}

/** Canonical romaji spellings accepted by the parser, longest first. */
const ROMAJI_TO_KANA: Record<string, string> = {};
for (const [consonant, row] of Object.entries(KANA_TABLE)) {
  for (const [vowel, kana] of Object.entries(row)) {
    ROMAJI_TO_KANA[consonant + vowel] = kana;
  }
}
Object.assign(ROMAJI_TO_KANA, {
  shi: "し", chi: "ち", tsu: "つ", ji: "じ", fu: "ふ",
  sha: "しゃ", shu: "しゅ", sho: "しょ",
  cha: "ちゃ", chu: "ちゅ", cho: "ちょ",
  ja: "じゃ", ju: "じゅ", jo: "じょ",
  xa: "ぁ", xi: "ぃ", xu: "ぅ", xe: "ぇ", xo: "ぉ",
  xtu: "っ", xtsu: "っ", n: "ん", nn: "ん",
});
for (const [vowel, kana] of Object.entries(VOWEL_KANA)) {
  ROMAJI_TO_KANA[vowel] = kana;
}
const ROMAJI_FORMS = Object.keys(ROMAJI_TO_KANA).sort(
  (a, b) => b.length - a.length,
);
const CONSONANTS = new Set("bcdfghjklmnpqrstvwxz");

interface Token {
  kana: string;
  size: number;
}

/** Find a complete mora tokenization of one alphabetic run, or null. */
function tokenizeRun(run: string): string | null {
  const phrase = PHRASES[run];
  if (phrase) return phrase;

  const memo = new Map<number, string | null>();

  function visit(index: number): string | null {
    if (index === run.length) return "";
    if (memo.has(index)) return memo.get(index) ?? null;

    const char = run[index];
    const next = run[index + 1];
    const after = run[index + 2];
    const candidates: Token[] = [];

    // Sokuon: a doubled consonant (but "nn" means ん).
    if (char !== "n" && CONSONANTS.has(char) && next === char) {
      candidates.push({ kana: "っ", size: 1 });
    }

    // Small-ya combinations: kya, sha, cha, ja, … (also fya/vya).
    if (next === "y" && after && VOWELS.includes(after)) {
      const base =
        char === "s" ? "し" :
        char === "t" || char === "c" ? "ち" :
        char === "j" ? "じ" :
        char === "f" ? "ふ" :
        char === "v" ? "ゔ" :
        KANA_TABLE[char]?.i;
      if (base && SMALL_Y[after]) {
        candidates.push({ kana: base + SMALL_Y[after], size: 3 });
      }
    }

    for (const form of ROMAJI_FORMS) {
      if (!run.startsWith(form, index)) continue;
      // n + vowel/y starts the next mora (na, ni, …).
      if (form === "n" && next && /[aiueoy]/.test(next)) continue;
      // nn + vowel is parsed as ん followed by that vowel-initial mora.
      if (form === "nn" && after && /[aiueo]/.test(after)) continue;
      candidates.push({ kana: ROMAJI_TO_KANA[form], size: form.length });
    }
    if (char === "n" && next === "'") {
      candidates.push({ kana: "ん", size: 2 });
    }

    for (const token of candidates) {
      const rest = visit(index + token.size);
      if (rest !== null) {
        const result = token.kana + rest;
        memo.set(index, result);
        return result;
      }
    }

    memo.set(index, null);
    return null;
  }

  return visit(0);
}

function romajiToKana(input: string, target: "hiragana" | "katakana"): string {
  const normalized = input
    .replace(/[āīūēōĀĪŪĒŌ]/g, (char) => MACRONS[char] ?? char)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .toLowerCase();

  let output = "";
  for (const segment of normalized.split(/([^a-z']+)/)) {
    if (!segment) continue;
    if (/^[a-z']+$/.test(segment)) {
      const kana = tokenizeRun(segment);
      // Preserve tokens that are not Japanese words (e.g. English text).
      output += kana ?? segment;
    } else {
      output += segment;
    }
  }

  return target === "katakana" ? toKatakana(output) : output;
}

/** Convert between any two of romaji, hiragana and katakana. */
export function convertText(text: string, from: Script, to: Script): string {
  const normalized = text.normalize("NFKC");
  if (from === to) return normalized;
  if (from === "romaji") return romajiToKana(normalized, to === "katakana" ? "katakana" : "hiragana");
  if (to === "romaji") return toRomaji(normalized);
  if (to === "katakana") return toKatakana(normalized);
  return toHiragana(normalized);
}
