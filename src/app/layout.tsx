import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import {
  LEVELS,
  SITE_NAME,
  SITE_URL,
  levelHref,
  practiceHref,
} from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | JLPT N5–N1 Japanese Learning`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Free, offline-friendly Japanese study tools for JLPT N5 through N1: kanji, vocabulary, grammar, kana drills, and spaced repetition with no account required.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans text-slate-950 antialiased dark:bg-slate-950 dark:text-slate-50">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200 dark:border-slate-800">
            <nav
              aria-label="Main navigation"
              className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8"
            >
              <Link
                href="/"
                className="text-lg font-black tracking-tight text-slate-950 dark:text-white"
              >
                Tokyo<span className="text-emerald-700 dark:text-emerald-400">Learn</span>
              </Link>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {LEVELS.map((level) => (
                  <Link
                    key={level}
                    href={levelHref(level)}
                    className="hover:text-emerald-700 dark:hover:text-emerald-400"
                  >
                    {level}
                  </Link>
                ))}
                <span
                  aria-hidden="true"
                  className="hidden h-4 w-px bg-slate-300 sm:block dark:bg-slate-700"
                />
                <Link
                  href="/exams/"
                  className="hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  Exams
                </Link>
                <Link
                  href={practiceHref("flashcards", "N5")}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  Flashcards
                </Link>
                <Link
                  href={practiceHref("quiz", "N5")}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  Quiz
                </Link>
                <Link
                  href="/tools/"
                  className="hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  Tools
                </Link>
              </div>
            </nav>
          </header>

          <div className="flex-1">{children}</div>

          <footer className="border-t border-slate-200 py-8 dark:border-slate-800">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:text-slate-400">
              <p>© {new Date().getFullYear()} TokyoLearn. Study at your own pace.</p>
              <p>Static site · No login · Progress saved locally</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
