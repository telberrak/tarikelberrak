"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme-script";

type Theme = "light" | "dark";

export function ThemeToggle({ className }: { className?: string }) {
  // Starts null so the server-rendered markup and first client render match
  // (the real theme was already applied to <html> by the inline script,
  // before React ever mounts) — we just read it back after mount.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // Reads the attribute the inline script already set on <html> before
    // paint. Starting from `null` here (rather than a lazy useState
    // initializer) is deliberate: it keeps the server-rendered markup and
    // the client's first render pass identical, avoiding a hydration
    // mismatch — this effect is syncing with that external DOM state, not
    // deriving it from props/state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private browsing / storage blocked — theme just won't persist.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-faint text-text-dim transition-colors hover:border-border hover:text-text-primary ${className ?? ""}`}
    >
      {theme === "light" ? (
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
          <path
            d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM10 2.5v1.67M10 15.83V17.5M4.34 4.34l1.18 1.18M14.48 14.48l1.18 1.18M2.5 10h1.67M15.83 10h1.67M4.34 15.66l1.18-1.18M14.48 5.52l1.18-1.18"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
          <path
            d="M17.08 12.13A7.08 7.08 0 0 1 7.87 2.92a7.5 7.5 0 1 0 9.21 9.21Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
