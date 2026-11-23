# TokyoLearn

Free, login-free JLPT Japanese study site. Built with Next.js App Router, TypeScript, and Tailwind CSS v4, and deployed as a **fully static export** to Cloudflare Pages.

Everything runs in the browser: datasets are plain JSON, progress lives in `localStorage`, and there is no backend, account system, or analytics.

## Requirements

- Node.js 22+ (needed for the `--experimental-strip-types` flag used by `npm run verify:data`)
- npm

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Type-check and generate the static export in `out/` |
| `npm run lint` | Run ESLint across the project |
| `npm run verify:data` | Type-check plus runtime validation of every JSON dataset |
| `npm run fetch:data` | Regenerate `/data` from upstream open-source JLPT data |
| `npm run fetch:data -- --refresh` | Force re-download of upstream sources |

Run the full verification locally with:

```bash
npm run lint && npm run verify:data && npm run build
```

A successful build prints a route table and writes `out/index.html`, `out/404.html`, `out/sitemap.xml`, and one `index.html` per route.

## What's included

- **JLPT hubs** at `/jlpt/n5` … `/jlpt/n1` with searchable kanji and vocabulary grids
- **2,383 kanji detail pages** at `/kanji/<character>` with readings, meanings, radicals, stroke counts, and examples
- **Flashcards** at `/practice/flashcards` — kanji or vocabulary, Space to flip, `1`/`2`/`3` to grade, audio pronunciation, and per-level mastery progress
- **Quizzes** at `/practice/quiz` — 10/20/50 questions, three question types, same-level distractors, streaks, and missed-item review
- **過去問題集** at `/exams` — bilingual JLPT N5–N1 paper bank with level/section filters, 本番モード timed runs, 練習モード instant feedback, review screens, retry-missed drills, and best scores saved locally
- **Text analyzer** at `/tools/text-analyzer` — script counts and estimated N5–N1 kanji distribution for pasted Japanese text
- **Kana converter** at `/tools/kana-converter` — romaji ⇄ hiragana ⇄ katakana with one-click copy
- An automatically generated `sitemap.xml` and a custom 404 page

Deep links such as `/practice/quiz?level=n5` pre-select a level without any server-side request parsing.

## Project structure

```text
data/                  Versioned JSON datasets (tracked in Git)
  kanji-n{5..1}.json
  vocab-n{5..1}.json
scripts/               Dataset fetch/generation and verification
src/app/               Static App Router pages, layouts, sitemap, 404
src/components/        Reusable UI and client-side study tools
src/lib/               Pure TypeScript helpers (data, SRS, URLs, kana)
src/types/             Shared TypeScript interfaces
out/                   Generated static export (gitignored)
```

`next.config.ts` deliberately keeps the export strict:

```ts
output: "export",
trailingSlash: true,
images: { unoptimized: true }
```

Do not add Server Actions, middleware, route handlers, `cookies()`/`headers()`, request-time `searchParams`, or any other feature that requires a running server. Dynamic-looking routes are allowed only when every slug is known at build time and returned from `generateStaticParams()` (with `dynamicParams = false`). Browser-only state is read through `useSyncExternalStore` or inside effects, and all progress is namespaced under `tokyolearn:progress:v1` in `localStorage`.

## Datasets

The JSON files in `data/` are committed to Git and loaded at build time (or lazily on the client for study tools). See [`data/README.md`](data/README.md) for counts, schemas, regeneration commands, and upstream attribution.

## Deploying to Cloudflare Pages

| Setting | Value |
| --- | --- |
| Framework preset | Next.js |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node version | 22 or newer |

Cloudflare Pages serves the generated files as-is; no Workers, functions, or environment variables are required. You can verify the output locally with any static file server, for example `npx serve out`.

The canonical site URL used in metadata and the sitemap is `https://tokyolearn.com`.
