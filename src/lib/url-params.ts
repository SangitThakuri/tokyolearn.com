"use client";

/**
 * Static exports cannot read request-time `searchParams`, so practice options
 * are read from (and written back to) `window.location` entirely on the client.
 * Both `?level=n5&mode=vocab` and `#n5-vocab` style links are supported.
 */
import { useMemo, useSyncExternalStore } from "react";
import type { JlptLevel } from "@/types/japanese";
import type { QuestionCount, QuizType, StudyMode } from "@/types/study";
import { LEVELS } from "@/lib/site";

export interface PracticeParams {
  level: JlptLevel;
  mode: StudyMode;
  type: QuizType;
  count: QuestionCount;
}

const DEFAULTS: PracticeParams = {
  level: "N5",
  mode: "kanji",
  type: "kanjiToReading",
  count: 10,
};

const CHANGE_EVENT = "tokyolearn:locationchange";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  window.addEventListener("hashchange", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function getSnapshot(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.search}|${window.location.hash}`;
}

function getServerSnapshot(): string {
  return "";
}

function parseLevel(value: string | null | undefined): JlptLevel | undefined {
  const upper = value?.toUpperCase();
  return LEVELS.find((level) => level === upper);
}

function parseMode(value: string | null | undefined): StudyMode | undefined {
  switch (value?.toLowerCase()) {
    case "kanji":
    case "k":
      return "kanji";
    case "vocab":
    case "vocabulary":
    case "v":
      return "vocab";
    default:
      return undefined;
  }
}

function parseType(value: string | null | undefined): QuizType | undefined {
  switch (value?.toLowerCase()) {
    case "kanjitoreading":
    case "kanji-reading":
      return "kanjiToReading";
    case "readingtokanji":
    case "reading-kanji":
    case "reverse":
      return "readingToKanji";
    case "meaningtokanji":
    case "meaning-kanji":
    case "meaning":
      return "meaningToKanji";
    default:
      return undefined;
  }
}

function parseCount(value: string | null | undefined): QuestionCount | undefined {
  const parsed = Number(value);
  return parsed === 10 || parsed === 20 || parsed === 50 ? parsed : undefined;
}

function parseSnapshot(snapshot: string): PracticeParams {
  if (!snapshot) return DEFAULTS;
  const [search = "", hash = ""] = snapshot.split("|");
  const query = new URLSearchParams(search.replace(/^\?/, ""));
  const tokens = hash
    .replace(/^#/, "")
    .split(/[-/&\s]+/)
    .filter(Boolean);
  const findToken = (predicate: (token: string) => boolean) =>
    tokens.find(predicate);

  return {
    level:
      parseLevel(query.get("level")) ??
      parseLevel(findToken((token) => /^n[1-5]$/.test(token.toLowerCase()))) ??
      DEFAULTS.level,
    mode:
      parseMode(query.get("mode")) ??
      parseMode(
        findToken((token) => ["kanji", "vocab", "vocabulary"].includes(token.toLowerCase())),
      ) ??
      DEFAULTS.mode,
    type:
      parseType(query.get("type") ?? query.get("quiz")) ??
      parseType(
        findToken((token) => parseType(token) !== undefined),
      ) ??
      DEFAULTS.type,
    count:
      parseCount(query.get("count") ?? query.get("questions")) ??
      parseCount(findToken((token) => parseCount(token) !== undefined)) ??
      DEFAULTS.count,
  };
}

/** Current practice options, kept in sync with the browser URL. */
export function usePracticeParams(): PracticeParams {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return useMemo(() => parseSnapshot(snapshot), [snapshot]);
}

/** Update the URL without a full navigation so the view can stay mounted. */
export function setPracticeParams(patch: Partial<PracticeParams>): void {
  if (typeof window === "undefined") return;

  const current = parseSnapshot(getSnapshot());
  const next = { ...current, ...patch };
  const url = new URL(window.location.href);

  function set(key: string, value: string, defaultValue: string) {
    if (value === defaultValue) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  }

  set("level", next.level, DEFAULTS.level);
  set("mode", next.mode, DEFAULTS.mode);
  set("type", next.type, DEFAULTS.type);
  set("count", String(next.count), String(DEFAULTS.count));

  window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
