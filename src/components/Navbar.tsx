"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LEVELS, levelHref, practiceHref } from "@/lib/site";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const STUDY_LINKS = [
  { href: "/exams/", label: "過去問題集", hint: "Exams" },
  { href: practiceHref("flashcards", "N5"), label: "Flashcards" },
  { href: practiceHref("quiz", "N5"), label: "Quiz" },
  { href: "/tools/", label: "Tools" },
] as const;

const themeListeners = new Set<() => void>();

function subscribeTheme(onChange: () => void): () => void {
  themeListeners.add(onChange);
  return () => {
    themeListeners.delete(onChange);
  };
}

function getThemeSnapshot(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function getServerThemeSnapshot(): boolean {
  return false;
}

function applyTheme(dark: boolean): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", dark);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
  } catch {
    // Private mode or blocked storage: the class still applies for this visit.
  }
  for (const listener of themeListeners) listener();
}

function isActive(pathname: string, href: string): boolean {
  const current = pathname.replace(/\/$/, "") || "/";
  const target = href.split("?")[0].replace(/\/$/, "") || "/";
  return current === target || (target !== "/" && current.startsWith(`${target}/`));
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
      <path
        d="M20.4 14.2A8.5 8.5 0 0 1 9.8 3.6a8.5 8.5 0 1 0 10.6 10.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
      {open ? (
        <path
          d="m6 6 12 12M18 6 6 18"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function ThemeToggle({
  dark,
  onToggle,
  className = "",
}: {
  dark: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={dark}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={`grid size-9 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-emerald-500 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400 ${className}`}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function desktopLinkClass(active: boolean): string {
  const base =
    "rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";
  return active
    ? `${base} bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-400`
    : `${base} text-slate-600 hover:bg-white hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400`;
}

function mobileLinkClass(active: boolean): string {
  const base =
    "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";
  return active
    ? `${base} bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400`
    : `${base} bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400`;
}

export function Navbar() {
  const pathname = usePathname();
  const isDark = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const toggleTheme = () => applyTheme(!isDark);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-slate-50/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8"
      >
        <Link
          href="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-emerald-700 text-lg font-black text-white shadow-sm dark:bg-emerald-600">
            <span lang="ja">東</span>
          </span>
          <span className="text-base font-black tracking-tight text-slate-950 dark:text-white">
            Tokyo<span className="text-emerald-700 dark:text-emerald-400">Learn</span>
          </span>
        </Link>

        <div
          className="hidden items-center gap-0.5 lg:flex"
          role="group"
          aria-label="JLPT levels"
        >
          <span className="mr-2 text-[11px] font-black tracking-[0.18em] text-slate-400 uppercase dark:text-slate-500">
            JLPT
          </span>
          {LEVELS.map((level) => (
            <Link
              key={level}
              href={levelHref(level)}
              aria-current={isActive(pathname, levelHref(level)) ? "page" : undefined}
              className={desktopLinkClass(isActive(pathname, levelHref(level)))}
            >
              {level}
            </Link>
          ))}
        </div>

        <div
          className="hidden items-center gap-0.5 lg:flex"
          role="group"
          aria-label="Study modes"
        >
          {STUDY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={desktopLinkClass(isActive(pathname, link.href))}
            >
              <span lang={link.label === "過去問題集" ? "ja" : undefined}>
                {link.label}
              </span>
              {"hint" in link && link.hint ? (
                <span className="ml-1 text-xs font-semibold opacity-70">
                  {link.hint}
                </span>
              ) : null}
            </Link>
          ))}
          <span
            aria-hidden="true"
            className="mx-2 h-5 w-px bg-slate-200 dark:bg-slate-700"
          />
          <ThemeToggle dark={isDark} onToggle={toggleTheme} />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle dark={isDark} onToggle={toggleTheme} />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:border-emerald-500 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white px-5 py-5 shadow-xl lg:hidden dark:border-slate-800 dark:bg-slate-950 sm:px-8"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
            <div>
              <p className="px-3 text-[11px] font-black tracking-[0.18em] text-slate-400 uppercase dark:text-slate-500">
                JLPT levels
              </p>
              <div className="mt-2 grid grid-cols-5 gap-2">
                {LEVELS.map((level) => (
                  <Link
                    key={level}
                    href={levelHref(level)}
                    onClick={closeMenu}
                    aria-current={
                      isActive(pathname, levelHref(level)) ? "page" : undefined
                    }
                    className={`grid place-items-center rounded-xl px-2 py-2 text-sm font-bold transition-colors ${
                      isActive(pathname, levelHref(level))
                        ? "bg-emerald-700 text-white dark:bg-emerald-600"
                        : "bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-emerald-950/40"
                    }`}
                  >
                    {level}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="px-3 text-[11px] font-black tracking-[0.18em] text-slate-400 uppercase dark:text-slate-500">
                Study modes
              </p>
              <div className="mt-2 flex flex-col gap-2">
                {STUDY_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={isActive(pathname, link.href) ? "page" : undefined}
                    className={mobileLinkClass(isActive(pathname, link.href))}
                  >
                    <span>
                      <span lang={link.label === "過去問題集" ? "ja" : undefined}>
                        {link.label}
                      </span>
                      {"hint" in link && link.hint ? (
                        <span className="ml-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                          {link.hint}
                        </span>
                      ) : null}
                    </span>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
