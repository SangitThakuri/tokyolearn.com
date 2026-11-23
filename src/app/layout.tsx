import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

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
      <head>
        <Script id="tokyolearn-theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
      </head>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
        <div className="flex min-h-screen flex-col">
          <Navbar />

          <div className="flex-1">{children}</div>

          <footer className="border-t border-slate-200 bg-white/60 py-8 dark:border-slate-800 dark:bg-slate-950/60">
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
