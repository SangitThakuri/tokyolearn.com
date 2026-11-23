<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# TokyoLearn.com — Agent Rules

## Architecture

- Stack: Next.js **App Router**, TypeScript, Tailwind CSS v4.
- The whole site is a **static export** deployed to **Cloudflare Pages**.
  `next.config.ts` must keep exactly these settings:
  - `output: "export"`
  - `trailingSlash: true`
  - `images: { unoptimized: true }`
- `next build` must succeed and emit a complete, self-contained `out/` directory.
  Cloudflare Pages build command: `npm run build`; output directory: `out`.
- Forbidden in this project:
  - Server Actions (`"use server"`)
  - Middleware (`middleware.ts` / `src/middleware.ts`)
  - Route handlers / API routes (`src/app/api/**`)
  - Runtime request APIs (`cookies()`, `headers()`, `draftMode()`,
    request-time `searchParams`), SSR-only Node APIs, or any feature that needs a
    running server.
- All pages must be statically renderable. Dynamic-looking routes (e.g.
  `/n5/kanji/[character]`) are allowed only when every slug is known at build time
  and provided through `generateStaticParams()`. Never rely on runtime params.
- Prefer pure TypeScript helpers in `src/lib/` over server-side data layers.

## Folder structure

```
.
├── data/                 # GitHub-hosted JSON datasets, versioned with this repo
│   ├── absolute-beginner/
│   ├── exams/            # past-paper-style exam JSON files (one paper per file)
│   ├── n5/
│   ├── n4/
│   ├── n3/
│   ├── n2/
│   └── n1/
├── out/                  # generated static export (gitignored, never hand-edit)
├── public/               # static assets copied as-is into the export
└── src/
    ├── app/              # static App Router routes (pages/layouts only, no api/)
    ├── components/       # reusable UI; add "use client" only where needed
    └── lib/              # types, level metadata, SRS helpers, localStorage utils
```

- All routes live under `src/app`. Every route must be reachable from a static
  path or a build-time-generated slug.
- Datasets live in `/data` as JSON, are hosted/versioned on GitHub, and are read
  either by static import at build time or by a client-side fetch of the raw
  GitHub URL. There is no runtime database and no server fetch layer.
- Keep `data/` filenames predictable (`kanji.json`, `vocab.json`,
  `grammar.json`, `kana.json`) per level.
- Exam papers live in `data/exams/<level>-<slug>.json` (for example
  `n5-sample-01.json`). The paper's `id` must match the filename without
  `.json`; its schema is defined in `src/types/exam.ts`.

### Adding an exam paper (automatic static pages)

- To publish a new paper, add one valid JSON file to `data/exams/` and push.
  No route code needs to change.
- `npm run build` runs `prebuild` → `npm run generate:exams`, which scans
  `data/exams/` and rewrites `src/generated/exam-manifest.ts`. Never hand-edit
  that generated file.
- `src/app/exams/[paperId]/page.tsx` calls `generateStaticParams()` from that
  manifest, so every paper becomes a static `out/exams/<paperId>/index.html`
  page and a sitemap entry at build time. Cloudflare Pages builds with
  `npm run build` on every push, so a git push with a new exam JSON file
  automatically generates and deploys its page.
- `npm run dev` runs the same generator through `predev`; restart `next dev`
  after adding a file so the new route is picked up locally.

## Aesthetic & UX

- Mobile-first: design for ~375px widths first, then scale up with `sm:`/`md:`.
- High-contrast typography: large, legible kanji, clear furigana using `<ruby>`,
  strong light/dark contrast, and a minimum 16px body size.
- Japanese text uses `lang="ja"`; interface chrome defaults to English.
- Dark mode via Tailwind `dark:` variants plus `color-scheme: light dark`; never
  hard-code light-only colors or assume a white background.
- Zero-login progress: store SRS/progress state only in `localStorage`. No auth,
  accounts, analytics, or backend. Namespace keys (e.g.
  `tokyolearn:progress:v1`) and guard all access for SSR safety.
- Respect `prefers-reduced-motion` and keep interactive controls keyboard
  accessible.
