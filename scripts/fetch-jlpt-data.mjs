#!/usr/bin/env node
/**
 * TokyoLearn JLPT dataset generator.
 *
 * Downloads open-source JLPT data and emits small, static JSON files into /data:
 *   kanji-n5.json ... kanji-n1.json
 *   vocab-n5.json ... vocab-n1.json
 *
 * Sources:
 *   - evanclan/OpenJLPT (Waller levels joined to JMdict / KANJIDIC2)
 *   - davidluzgouveia/kanji-data (WaniKani radical names, readings fallback)
 *   - scriptin/jmdict-simplified (common English JMdict, used for example words)
 *
 * All data is CC BY-SA 4.0 derived; see data/README.md for attribution.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "data");
const CACHE_DIR = path.join(ROOT, ".cache", "jlpt");

const LEVELS = [5, 4, 3, 2, 1];
const OPENJLPT_BASE =
  "https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json";
const KANJI_DATA_URL =
  "https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji.json";
const JMDICT_RELEASE_API =
  "https://api.github.com/repos/scriptin/jmdict-simplified/releases/latest";

const REFRESH = process.argv.includes("--refresh");

async function cachedFetch(url, fileName, { binary = false } = {}) {
  await mkdir(CACHE_DIR, { recursive: true });
  const target = path.join(CACHE_DIR, fileName);

  if (!REFRESH) {
    try {
      const cached = await readFile(target);
      return binary ? cached : JSON.parse(cached.toString("utf8"));
    } catch {
      // Cache miss or invalid entry: download again.
    }
  }

  const response = await fetch(url, {
    headers: { "User-Agent": "tokyolearn-jlpt-data-generator" },
  });
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(target, buffer);
  return binary ? buffer : JSON.parse(buffer.toString("utf8"));
}

/** Extract the first *.json member from a gzip-compressed tar archive. */
function extractTgzJson(compressed) {
  const tar = gunzipSync(compressed);
  let offset = 0;

  while (offset + 512 <= tar.length) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;

    const name = header
      .subarray(0, 100)
      .toString("utf8")
      .replace(/\0.*$/, "");
    const sizeText = header
      .subarray(124, 136)
      .toString("utf8")
      .replace(/\0.*$/, "")
      .trim();
    const size = Number.parseInt(sizeText, 8) || 0;

    offset += 512;
    const content = tar.subarray(offset, offset + size);
    if (name.endsWith(".json")) {
      return JSON.parse(content.toString("utf8"));
    }
    offset += Math.ceil(size / 512) * 512;
  }

  throw new Error("No JSON file found in downloaded .tgz archive");
}

function toHiragana(text) {
  return String(text)
    .replace(/[ァ-ヶ]/g, (char) =>
      String.fromCodePoint(char.codePointAt(0) - 0x60),
    )
    .replace(/[。、・\-."']/g, "");
}

function compactPosLabel(code, labels) {
  const raw = labels[code] ?? code;
  const short = raw.split(" (")[0].trim();
  return short.charAt(0).toLowerCase() + short.slice(1);
}

function jmdictExample(entry) {
  const word =
    entry.kanji?.find((item) => item.common)?.text ??
    entry.kanji?.[0]?.text ??
    entry.kana?.find((item) => item.common)?.text ??
    entry.kana?.[0]?.text;
  const reading =
    entry.kana?.find((item) => item.common)?.text ?? entry.kana?.[0]?.text;
  const meaning =
    entry.sense?.[0]?.gloss?.find((gloss) => gloss.lang === "eng")?.text ??
    entry.sense?.[0]?.gloss?.[0]?.text;

  if (!word || !reading || !meaning) return null;
  return { word, reading, meaning };
}

async function main() {
  console.log("Fetching JLPT datasets...");

  const [posLabels, kanjiData] = await Promise.all([
    cachedFetch(`${OPENJLPT_BASE}/pos.json`, "openjlpt-pos.json"),
    cachedFetch(KANJI_DATA_URL, "kanji-data.json"),
  ]);

  const openJlpt = {};
  for (const level of LEVELS) {
    const [kanji, vocab] = await Promise.all([
      cachedFetch(
        `${OPENJLPT_BASE}/kanji/n${level}.json`,
        `openjlpt-kanji-n${level}.json`,
      ),
      cachedFetch(
        `${OPENJLPT_BASE}/vocab/n${level}.json`,
        `openjlpt-vocab-n${level}.json`,
      ),
    ]);
    openJlpt[level] = { kanji, vocab };
  }

  const release = await fetch(JMDICT_RELEASE_API, {
    headers: { "User-Agent": "tokyolearn-jlpt-data-generator" },
  });
  if (!release.ok) {
    throw new Error(`Failed to resolve JMdict release: ${release.status}`);
  }
  const releaseJson = await release.json();
  const jmdictAsset = releaseJson.assets?.find((asset) =>
    /^jmdict-eng-.*\.json\.tgz$/.test(asset.name),
  );
  if (!jmdictAsset) {
    throw new Error("Could not find an English JMdict .tgz asset in latest release");
  }
  console.log(`Using jmdict-simplified ${releaseJson.tag_name}`);

  const jmdictBuffer = await cachedFetch(
    jmdictAsset.browser_download_url,
    jmdictAsset.name,
    { binary: true },
  );
  const jmdict = extractTgzJson(jmdictBuffer);

  // Index example words by character and by surface form.
  const jmdictByCharacter = new Map();
  const jmdictByWord = new Map();
  for (const entry of jmdict.words ?? []) {
    const example = jmdictExample(entry);
    if (!example) continue;
    if (!jmdictByWord.has(example.word)) {
      jmdictByWord.set(example.word, example);
    }
    for (const character of new Set([...example.word])) {
      const list = jmdictByCharacter.get(character) ?? [];
      list.push(example);
      jmdictByCharacter.set(character, list);
    }
  }

  // Flatten JLPT vocab, easiest levels first, for preferred examples.
  const allVocab = LEVELS.flatMap((level) => openJlpt[level].vocab);
  const vocabByWord = new Map();
  const vocabByCharacter = new Map();
  for (const entry of allVocab) {
    if (!entry.word || !entry.reading || !entry.meanings?.length) continue;
    const example = {
      word: entry.word,
      reading: entry.reading,
      meaning: entry.meanings[0],
    };
    if (!vocabByWord.has(example.word)) vocabByWord.set(example.word, example);
    for (const character of new Set([...example.word])) {
      const list = vocabByCharacter.get(character) ?? [];
      list.push(example);
      vocabByCharacter.set(character, list);
    }
  }

  function buildExamples(kanji, extra = {}) {
    const examples = [];
    const seen = new Set();

    function add(example, rank) {
      if (!example?.word || !example.reading || !example.meaning) return;
      const key = `${example.word}\0${example.reading}`;
      if (seen.has(key)) return;
      seen.add(key);
      examples.push({
        word: example.word,
        reading: example.reading,
        meaning: example.meaning,
        rank,
        length: [...example.word].length,
      });
    }

    // 1. JLPT vocabulary (best for learners).
    for (const example of vocabByCharacter.get(kanji.character) ?? []) {
      add(example, 0);
    }
    // 2. Curated compounds from the kanji source, resolved to a reading/meaning.
    for (const word of kanji.words ?? []) {
      add(vocabByWord.get(word) ?? jmdictByWord.get(word), 1);
    }
    // 3. Common JMdict words containing the kanji.
    for (const example of jmdictByCharacter.get(kanji.character) ?? []) {
      add(example, 2);
    }
    // 4. Last resort: the kanji itself with its own readings.
    const selfReadings = [
      ...(kanji.onyomi ?? []),
      ...(kanji.kunyomi ?? []),
      ...(kanji.nanori ?? []),
      ...(extra.readings_on ?? []),
      ...(extra.readings_kun ?? []),
      ...(extra.wk_readings_on ?? []),
      ...(extra.wk_readings_kun ?? []),
    ]
      .map(toHiragana)
      .filter(Boolean);
    for (const reading of selfReadings.slice(0, 3)) {
      add(
        {
          word: kanji.character,
          reading,
          meaning: kanji.meanings?.[0] ?? "",
        },
        3,
      );
    }

    // A handful of rare name-only kanji have fewer than three distinct readings
    // or senses. Fill the remaining slots from the kanji's own data so the
    // dataset contract of exactly three examples always holds.
    if (examples.length < 3 && selfReadings.length > 0) {
      const primaryReading = selfReadings[0];
      for (const meaning of kanji.meanings ?? []) {
        if (examples.length >= 3) break;
        if (!meaning) continue;
        const key = `synthetic:${primaryReading}:${meaning}`;
        if (seen.has(key)) continue;
        seen.add(key);
        examples.push({
          word: kanji.character,
          reading: primaryReading,
          meaning,
          rank: 4,
          length: 1,
        });
      }
    }

    while (examples.length < 3) {
      const primaryReading =
        selfReadings[0] ?? kanji.onyomi?.[0] ?? kanji.character;
      const primaryMeaning = kanji.meanings?.[0] ?? "";
      const key = `pad:${examples.length}:${primaryReading}`;
      seen.add(key);
      examples.push({
        word: kanji.character,
        reading: primaryReading,
        meaning: primaryMeaning,
        rank: 5,
        length: 1,
      });
    }

    examples.sort(
      (a, b) =>
        a.rank - b.rank ||
        a.length - b.length ||
        a.word.localeCompare(b.word, "ja"),
    );

    return examples.slice(0, 3).map(({ word, reading, meaning }) => ({
      word,
      reading,
      meaning,
    }));
  }

  await mkdir(DATA_DIR, { recursive: true });

  for (const level of LEVELS) {
    const jlpt = `N${level}`;

    const kanji = openJlpt[level].kanji.map((entry) => {
      const extra = kanjiData[entry.character] ?? {};
      const radicals = [];
      for (const radical of [entry.radical, ...(extra.wk_radicals ?? [])]) {
        if (radical && !radicals.includes(radical)) radicals.push(radical);
      }
      const meanings =
        entry.meanings?.filter(Boolean).length > 0
          ? entry.meanings
          : extra.meanings ?? [];

      return {
        character: entry.character,
        jlpt,
        strokes: Number(entry.strokes ?? extra.strokes ?? 0),
        onyomi: entry.onyomi ?? extra.readings_on ?? [],
        kunyomi: entry.kunyomi ?? extra.readings_kun ?? [],
        meanings,
        radicals,
        examples: buildExamples(entry, extra),
      };
    });

    const vocab = openJlpt[level].vocab.map((entry) => {
      const labels = [
        ...new Set(
          (entry.pos ?? []).map((code) => compactPosLabel(code, posLabels)),
        ),
      ];
      return {
        word: entry.word,
        reading: entry.reading,
        meaning: entry.meanings?.[0] ?? "",
        jlpt,
        partOfSpeech: labels.length > 0 ? labels.join(", ") : "unknown",
      };
    });

    await writeJson(`kanji-n${level}.json`, kanji);
    await writeJson(`vocab-n${level}.json`, vocab);
    console.log(
      `${jlpt}: ${kanji.length} kanji, ${vocab.length} vocabulary entries`,
    );
  }

  console.log(`Wrote generated datasets to ${DATA_DIR}`);
}

async function writeJson(fileName, items) {
  const body = `[\n${items.map((item) => `  ${JSON.stringify(item)}`).join(",\n")}\n]\n`;
  await writeFile(path.join(DATA_DIR, fileName), body, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
