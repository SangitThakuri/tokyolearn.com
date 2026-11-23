/**
 * Runtime + type-level verification of the generated /data JSON files.
 * The interfaces in src/types/japanese.ts are the source of truth.
 *
 * Run with: npm run verify:data
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  JlptLevel,
  KanjiDataset,
  KanjiEntry,
  VocabDataset,
  VocabEntry,
} from "../src/types/japanese";
import type {
  ExamDataset,
  ExamListening,
  ExamLocalizedText,
  ExamPaper,
  ExamPassage,
  ExamQuestion,
  ExamQuestionType,
  ExamScrambledSentence,
  ExamSection,
} from "../src/types/exam";
import type {
  JlptOverviewDataset,
  LocalizedLabel,
  ReferenceDataset,
  TopicReferenceDataset,
} from "../src/types/reference";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LEVELS: readonly JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

function readJson(relativePath: string): unknown {
  return JSON.parse(readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function assertKanjiDataset(value: unknown, level: JlptLevel): asserts value is KanjiDataset {
  if (!Array.isArray(value)) {
    throw new Error(`kanji-${level.toLowerCase()}.json is not an array`);
  }

  value.forEach((raw, index) => {
    const where = `kanji-${level.toLowerCase()}[${index}]`;
    if (!isRecord(raw)) throw new Error(`${where} is not an object`);
    if (typeof raw.character !== "string" || raw.character.length === 0) {
      throw new Error(`${where}.character must be a non-empty string`);
    }
    if (raw.jlpt !== level) throw new Error(`${where}.jlpt must be ${level}`);
    if (typeof raw.strokes !== "number" || raw.strokes < 0) {
      throw new Error(`${where}.strokes must be a non-negative number`);
    }
    for (const key of ["onyomi", "kunyomi", "meanings", "radicals"] as const) {
      if (!isStringArray(raw[key])) {
        throw new Error(`${where}.${key} must be a string array`);
      }
    }
    if (!Array.isArray(raw.examples) || raw.examples.length !== 3) {
      throw new Error(`${where}.examples must contain exactly 3 examples`);
    }
    raw.examples.forEach((example, exampleIndex) => {
      if (!isRecord(example)) {
        throw new Error(`${where}.examples[${exampleIndex}] is not an object`);
      }
      for (const key of ["word", "reading", "meaning"] as const) {
        if (typeof example[key] !== "string" || example[key].length === 0) {
          throw new Error(
            `${where}.examples[${exampleIndex}].${key} must be a non-empty string`,
          );
        }
      }
    });
  });
}

function assertVocabDataset(value: unknown, level: JlptLevel): asserts value is VocabDataset {
  if (!Array.isArray(value)) {
    throw new Error(`vocab-${level.toLowerCase()}.json is not an array`);
  }

  value.forEach((raw, index) => {
    const where = `vocab-${level.toLowerCase()}[${index}]`;
    if (!isRecord(raw)) throw new Error(`${where} is not an object`);
    for (const key of ["word", "reading", "meaning", "partOfSpeech"] as const) {
      if (typeof raw[key] !== "string" || raw[key].length === 0) {
        throw new Error(`${where}.${key} must be a non-empty string`);
      }
    }
    if (raw.jlpt !== level) throw new Error(`${where}.jlpt must be ${level}`);
  });
}

const EXAM_SECTIONS: readonly ExamSection[] = [
  "vocab",
  "grammar",
  "reading",
  "listening",
];

const EXAM_SECTION_FOR_TYPE: Record<ExamQuestionType, ExamSection> = {
  "kanji-reading": "vocab",
  orthography: "vocab",
  "contextual-expression": "vocab",
  paraphrase: "vocab",
  usage: "vocab",
  "sentence-grammar": "grammar",
  "scrambled-sentence": "grammar",
  "text-grammar": "grammar",
  "short-reading": "reading",
  "mid-length-reading": "reading",
  "listening-comprehension": "listening",
};

const EXAM_QUESTION_TYPES = Object.keys(EXAM_SECTION_FOR_TYPE) as ExamQuestionType[];

function assertLocalizedText(
  value: unknown,
  where: string,
): asserts value is ExamLocalizedText {
  if (!isRecord(value)) throw new Error(`${where} must be an object`);
  for (const key of ["ja", "en"] as const) {
    if (typeof value[key] !== "string" || value[key].length === 0) {
      throw new Error(`${where}.${key} must be a non-empty string`);
    }
  }
}

function assertExamListening(
  value: unknown,
  where: string,
): asserts value is ExamListening {
  if (!isRecord(value)) throw new Error(`${where} must be an object`);
  assertLocalizedText(value.transcript, `${where}.transcript`);
  if (value.audioUrl !== undefined && typeof value.audioUrl !== "string") {
    throw new Error(`${where}.audioUrl must be a string when present`);
  }
  if (value.speechLang !== undefined && typeof value.speechLang !== "string") {
    throw new Error(`${where}.speechLang must be a string when present`);
  }
  if (
    value.speechRate !== undefined &&
    (typeof value.speechRate !== "number" || value.speechRate <= 0)
  ) {
    throw new Error(`${where}.speechRate must be a positive number when present`);
  }
}

function assertScrambled(
  value: unknown,
  where: string,
): asserts value is ExamScrambledSentence {
  if (!isRecord(value)) throw new Error(`${where} must be an object`);
  if (
    !Array.isArray(value.correctOrder) ||
    value.correctOrder.length !== 4 ||
    !value.correctOrder.every(
      (index) => Number.isInteger(index) && index >= 0 && index < 4,
    ) ||
    new Set(value.correctOrder).size !== 4
  ) {
    throw new Error(`${where}.correctOrder must list each choice index 0–3 once`);
  }
  if (
    typeof value.starSlotIndex !== "number" ||
    !Number.isInteger(value.starSlotIndex) ||
    value.starSlotIndex < 0 ||
    value.starSlotIndex > 3
  ) {
    throw new Error(`${where}.starSlotIndex must be 0, 1, 2, or 3`);
  }
  if (
    typeof value.completedSentence !== "string" ||
    value.completedSentence.length === 0
  ) {
    throw new Error(`${where}.completedSentence must be a non-empty string`);
  }
}

function assertExamPassage(
  value: unknown,
  where: string,
  ids: Set<string>,
): asserts value is ExamPassage {
  if (!isRecord(value)) throw new Error(`${where} must be an object`);
  if (typeof value.id !== "string" || value.id.length === 0) {
    throw new Error(`${where}.id must be a non-empty string`);
  }
  if (ids.has(value.id)) throw new Error(`${where}.id is duplicated`);
  ids.add(value.id);
  assertLocalizedText(value.title, `${where}.title`);
  assertLocalizedText(value.text, `${where}.text`);
}

function assertExamQuestion(
  value: unknown,
  where: string,
  passageIds: Set<string>,
  ids: Set<string>,
): asserts value is ExamQuestion {
  if (!isRecord(value)) throw new Error(`${where} must be an object`);
  if (typeof value.id !== "string" || value.id.length === 0) {
    throw new Error(`${where}.id must be a non-empty string`);
  }
  if (ids.has(value.id)) throw new Error(`${where}.id is duplicated`);
  ids.add(value.id);

  if (!(EXAM_SECTIONS as readonly string[]).includes(value.section as string)) {
    throw new Error(`${where}.section is not a valid JLPT section`);
  }
  if (!EXAM_QUESTION_TYPES.includes(value.type as ExamQuestionType)) {
    throw new Error(`${where}.type is not a supported question type`);
  }
  if (
    EXAM_SECTION_FOR_TYPE[value.type as ExamQuestionType] !==
    (value.section as ExamSection)
  ) {
    throw new Error(`${where}: type does not match section`);
  }

  assertLocalizedText(value.prompt, `${where}.prompt`);
  assertLocalizedText(value.explanation, `${where}.explanation`);

  if (!Array.isArray(value.choices) || value.choices.length !== 4) {
    throw new Error(`${where}.choices must contain exactly four options`);
  }
  const labels = new Set<string>();
  value.choices.forEach((choice, index) => {
    if (!isRecord(choice)) throw new Error(`${where}.choices[${index}] is not an object`);
    if (typeof choice.label !== "string" || choice.label.length === 0) {
      throw new Error(`${where}.choices[${index}].label must be non-empty`);
    }
    if (typeof choice.text !== "string" || choice.text.length === 0) {
      throw new Error(`${where}.choices[${index}].text must be non-empty`);
    }
    if (labels.has(choice.label)) {
      throw new Error(`${where}.choices[${index}].label is duplicated`);
    }
    labels.add(choice.label);
    if (
      choice.translation !== undefined &&
      typeof choice.translation !== "string"
    ) {
      throw new Error(`${where}.choices[${index}].translation must be a string`);
    }
  });

  if (
    typeof value.correctIndex !== "number" ||
    !Number.isInteger(value.correctIndex) ||
    value.correctIndex < 0 ||
    value.correctIndex > 3
  ) {
    throw new Error(`${where}.correctIndex must be 0, 1, 2, or 3`);
  }

  if (value.section === "reading") {
    if (typeof value.passageId !== "string" || !passageIds.has(value.passageId)) {
      throw new Error(`${where}.passageId must reference a passage in this paper`);
    }
  }
  if (value.section === "listening") {
    assertExamListening(value.listening, `${where}.listening`);
  }
  if (value.type === "scrambled-sentence") {
    assertScrambled(value.scrambled, `${where}.scrambled`);
    const scrambled = value.scrambled as ExamScrambledSentence;
    const starAnswer = scrambled.correctOrder[scrambled.starSlotIndex];
    if (starAnswer !== value.correctIndex) {
      throw new Error(
        `${where}.correctIndex must match the choice in the ★ slot (${starAnswer})`,
      );
    }
  }
}

function assertExamPaper(value: unknown, file: string, id: string): asserts value is ExamPaper {
  if (!isRecord(value)) throw new Error(`${file} must contain an object`);
  if (value.id !== id) throw new Error(`${file}: "id" must be "${id}"`);
  if (!(LEVELS as readonly string[]).includes(value.level as string)) {
    throw new Error(`${file}: "level" must be N5–N1`);
  }
  for (const key of ["session"] as const) {
    if (typeof value[key] !== "string" || value[key].length === 0) {
      throw new Error(`${file}.${key} must be a non-empty string`);
    }
  }
  assertLocalizedText(value.title, `${file}.title`);
  assertLocalizedText(value.description, `${file}.description`);

  if (!Array.isArray(value.passages) || value.passages.length === 0) {
    throw new Error(`${file}.passages must contain at least one passage`);
  }
  const passageIds = new Set<string>();
  value.passages.forEach((passage, index) =>
    assertExamPassage(passage, `${file}.passages[${index}]`, passageIds),
  );

  if (!Array.isArray(value.questions) || value.questions.length === 0) {
    throw new Error(`${file}.questions must contain at least one question`);
  }
  const questionIds = new Set<string>();
  value.questions.forEach((question, index) =>
    assertExamQuestion(
      question,
      `${file}.questions[${index}]`,
      passageIds,
      questionIds,
    ),
  );
}

const REFERENCE_CATEGORIES = ["basics", "vocabulary", "grammar", "exam"] as const;
const SCORING_SECTION_IDS = [
  "language-knowledge",
  "reading",
  "listening",
  "language-reading",
] as const;

function assertLocalizedLabel(
  value: unknown,
  where: string,
): asserts value is LocalizedLabel {
  if (!isRecord(value)) throw new Error(`${where} must be an object`);
  for (const key of ["ja", "en"] as const) {
    if (typeof value[key] !== "string" || value[key].length === 0) {
      throw new Error(`${where}.${key} must be a non-empty string`);
    }
  }
}

function assertReferenceBase(value: Record<string, unknown>, where: string): void {
  if (typeof value.id !== "string" || value.id.length === 0) {
    throw new Error(`${where}.id must be a non-empty string`);
  }
  assertLocalizedLabel(value.title, `${where}.title`);
  assertLocalizedLabel(value.description, `${where}.description`);
  if (typeof value.icon !== "string" || value.icon.length === 0) {
    throw new Error(`${where}.icon must be a non-empty string`);
  }
  if (
    !REFERENCE_CATEGORIES.includes(
      value.category as (typeof REFERENCE_CATEGORIES)[number],
    )
  ) {
    throw new Error(`${where}.category is not a supported reference category`);
  }
  if (value.levels !== undefined) {
    if (
      !Array.isArray(value.levels) ||
      !value.levels.every((level) => (LEVELS as readonly string[]).includes(level))
    ) {
      throw new Error(`${where}.levels must contain only N5–N1 values`);
    }
  }
}

function assertReferenceItem(value: unknown, where: string): void {
  if (!isRecord(value)) throw new Error(`${where} must be an object`);
  if (typeof value.id !== "string" || value.id.length === 0) {
    throw new Error(`${where}.id must be a non-empty string`);
  }
  assertLocalizedLabel(value.term, `${where}.term`);

  for (const key of ["reading", "romaji", "group"] as const) {
    if (value[key] !== undefined && typeof value[key] !== "string") {
      throw new Error(`${where}.${key} must be a string when present`);
    }
  }
  if (value.detail !== undefined) {
    assertLocalizedLabel(value.detail, `${where}.detail`);
  }
  if (value.tags !== undefined && !isStringArray(value.tags)) {
    throw new Error(`${where}.tags must be a string array`);
  }

  if (value.fields !== undefined) {
    if (!Array.isArray(value.fields)) {
      throw new Error(`${where}.fields must be an array`);
    }
    value.fields.forEach((field, index) => {
      const fieldWhere = `${where}.fields[${index}]`;
      if (!isRecord(field)) throw new Error(`${fieldWhere} must be an object`);
      assertLocalizedLabel(field.label, `${fieldWhere}.label`);
      assertLocalizedLabel(field.value, `${fieldWhere}.value`);
    });
  }

  if (value.examples !== undefined) {
    if (!Array.isArray(value.examples)) {
      throw new Error(`${where}.examples must be an array`);
    }
    value.examples.forEach((example, index) => {
      const exampleWhere = `${where}.examples[${index}]`;
      assertLocalizedLabel(example, exampleWhere);
      if (
        isRecord(example) &&
        example.reading !== undefined &&
        typeof example.reading !== "string"
      ) {
        throw new Error(`${exampleWhere}.reading must be a string when present`);
      }
    });
  }
}

function assertTopicReferenceDataset(
  value: unknown,
  where: string,
): asserts value is TopicReferenceDataset {
  if (!isRecord(value)) throw new Error(`${where} must contain an object`);
  assertReferenceBase(value, where);
  if (!Array.isArray(value.items) || value.items.length === 0) {
    throw new Error(`${where}.items must contain at least one entry`);
  }
  const ids = new Set<string>();
  value.items.forEach((item, index) => {
    const itemWhere = `${where}.items[${index}]`;
    assertReferenceItem(item, itemWhere);
    if (isRecord(item)) {
      const id = item.id as string;
      if (ids.has(id)) throw new Error(`${itemWhere}.id is duplicated`);
      ids.add(id);
    }
  });
}

function assertJlptOverviewDataset(
  value: unknown,
  where: string,
): asserts value is JlptOverviewDataset {
  if (!isRecord(value)) throw new Error(`${where} must contain an object`);
  assertReferenceBase(value, where);
  if (!Array.isArray(value.levelsData) || value.levelsData.length !== LEVELS.length) {
    throw new Error(`${where}.levelsData must contain one entry per JLPT level`);
  }

  const seenLevels = new Set<string>();
  value.levelsData.forEach((rawLevel, index) => {
    const levelWhere = `${where}.levelsData[${index}]`;
    if (!isRecord(rawLevel)) throw new Error(`${levelWhere} must be an object`);
    if (!(LEVELS as readonly string[]).includes(rawLevel.level as string)) {
      throw new Error(`${levelWhere}.level must be N5–N1`);
    }
    const level = rawLevel.level as string;
    if (seenLevels.has(level)) throw new Error(`${levelWhere}.level is duplicated`);
    seenLevels.add(level);

    assertLocalizedLabel(rawLevel.label, `${levelWhere}.label`);
    assertLocalizedLabel(rawLevel.description, `${levelWhere}.description`);

    if (
      typeof rawLevel.totalMax !== "number" ||
      rawLevel.totalMax <= 0 ||
      typeof rawLevel.totalPass !== "number" ||
      rawLevel.totalPass <= 0 ||
      rawLevel.totalPass > rawLevel.totalMax
    ) {
      throw new Error(`${levelWhere}: invalid total maximum or pass mark`);
    }

    if (!Array.isArray(rawLevel.sections) || rawLevel.sections.length === 0) {
      throw new Error(`${levelWhere}.sections must not be empty`);
    }
    const sectionIds = new Set<string>();
    rawLevel.sections.forEach((rawSection, sectionIndex) => {
      const sectionWhere = `${levelWhere}.sections[${sectionIndex}]`;
      if (!isRecord(rawSection)) throw new Error(`${sectionWhere} must be an object`);
      if (
        !SCORING_SECTION_IDS.includes(
          rawSection.id as (typeof SCORING_SECTION_IDS)[number],
        )
      ) {
        throw new Error(`${sectionWhere}.id is not a supported JLPT section`);
      }
      const id = rawSection.id as string;
      if (sectionIds.has(id)) throw new Error(`${sectionWhere}.id is duplicated`);
      sectionIds.add(id);
      assertLocalizedLabel(rawSection.label, `${sectionWhere}.label`);
      if (
        typeof rawSection.max !== "number" ||
        rawSection.max <= 0 ||
        typeof rawSection.min !== "number" ||
        rawSection.min < 0 ||
        rawSection.min > rawSection.max
      ) {
        throw new Error(`${sectionWhere}: invalid maximum or minimum mark`);
      }
    });

    if (!Array.isArray(rawLevel.focus) || rawLevel.focus.length === 0) {
      throw new Error(`${levelWhere}.focus must not be empty`);
    }
    rawLevel.focus.forEach((focus, focusIndex) =>
      assertLocalizedLabel(focus, `${levelWhere}.focus[${focusIndex}]`),
    );
  });

  if (!Array.isArray(value.examWindows) || value.examWindows.length === 0) {
    throw new Error(`${where}.examWindows must not be empty`);
  }
  value.examWindows.forEach((seed, index) => {
    const seedWhere = `${where}.examWindows[${index}]`;
    if (!isRecord(seed)) throw new Error(`${seedWhere} must be an object`);
    if (typeof seed.year !== "number" || !Number.isInteger(seed.year)) {
      throw new Error(`${seedWhere}.year must be an integer`);
    }
    if (seed.month !== 7 && seed.month !== 12) {
      throw new Error(`${seedWhere}.month must be 7 or 12`);
    }
    if (
      typeof seed.day !== "number" ||
      !Number.isInteger(seed.day) ||
      seed.day < 1 ||
      seed.day > 31
    ) {
      throw new Error(`${seedWhere}.day must be a day of the month`);
    }
    if (typeof seed.official !== "boolean") {
      throw new Error(`${seedWhere}.official must be a boolean`);
    }
  });
}

function assertReferenceDataset(
  value: unknown,
  where: string,
): asserts value is ReferenceDataset {
  if (!isRecord(value)) throw new Error(`${where} must contain an object`);
  if (value.kind === "topic") {
    assertTopicReferenceDataset(value, where);
    return;
  }
  if (value.kind === "jlpt-overview") {
    assertJlptOverviewDataset(value, where);
    return;
  }
  throw new Error(`${where}.kind must be "topic" or "jlpt-overview"`);
}

let kanjiTotal = 0;
let vocabTotal = 0;

for (const level of LEVELS) {
  const suffix = level.toLowerCase();
  const rawKanji = readJson(`data/kanji-${suffix}.json`);
  const rawVocab = readJson(`data/vocab-${suffix}.json`);

  assertKanjiDataset(rawKanji, level);
  assertVocabDataset(rawVocab, level);

  // Compile-time proof that the verified values satisfy the shared interfaces.
  const kanji: KanjiDataset = rawKanji;
  const vocab: VocabDataset = rawVocab;
  const firstKanji: KanjiEntry | undefined = kanji[0];
  const firstVocab: VocabEntry | undefined = vocab[0];

  if (!firstKanji || !firstVocab) {
    throw new Error(`${level} datasets must not be empty`);
  }

  kanjiTotal += kanji.length;
  vocabTotal += vocab.length;
  console.log(
    `${level}: ${kanji.length} kanji, ${vocab.length} vocab — schema OK`,
  );
}

console.log(`Verified ${kanjiTotal} kanji and ${vocabTotal} vocabulary entries.`);

const examsDir = path.join(ROOT, "data", "exams");
const examFiles = readdirSync(examsDir)
  .filter((file) => file.endsWith(".json"))
  .sort();

if (examFiles.length === 0) {
  throw new Error("data/exams must contain at least one exam paper");
}

const exams: ExamDataset = [];
let examQuestionTotal = 0;

for (const file of examFiles) {
  const id = file.replace(/\.json$/, "");
  const rawExam = readJson(`data/exams/${file}`);
  assertExamPaper(rawExam, `data/exams/${file}`, id);

  const exam: ExamPaper = rawExam;
  exams.push(exam);
  examQuestionTotal += exam.questions.length;

  const sectionCounts = new Map<string, number>();
  for (const question of exam.questions) {
    sectionCounts.set(
      question.section,
      (sectionCounts.get(question.section) ?? 0) + 1,
    );
  }
  const summary = EXAM_SECTIONS.map(
    (section) => `${section}: ${sectionCounts.get(section) ?? 0}`,
  ).join(", ");
  console.log(`${exam.id} (${exam.level}): ${exam.questions.length} questions — ${summary}`);
}

console.log(
  `Verified ${exams.length} exam papers and ${examQuestionTotal} questions.`,
);

const referenceDir = path.join(ROOT, "data", "reference");
const referenceFiles = readdirSync(referenceDir)
  .filter((file) => file.endsWith(".json"))
  .sort();

if (referenceFiles.length < 9) {
  throw new Error("data/reference must contain all nine reference datasets");
}

let referenceItemTotal = 0;

for (const file of referenceFiles) {
  const rawReference = readJson(`data/reference/${file}`);
  assertReferenceDataset(rawReference, `data/reference/${file}`);

  // Compile-time proof that the verified values satisfy the shared interfaces.
  const dataset: ReferenceDataset = rawReference;
  const count =
    dataset.kind === "topic" ? dataset.items.length : dataset.levelsData.length;
  referenceItemTotal += count;
  console.log(`${file}: ${count} entries — schema OK`);
}

console.log(
  `Verified ${referenceFiles.length} reference datasets and ${referenceItemTotal} entries.`,
);
