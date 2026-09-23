"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/labs", label: "Labs" },
  { href: "/articles", label: "Articles" },
  { href: "/learn", label: "Learn" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Toggle menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-faint text-text-body"
      >
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
          <path d="M0 1H18M0 7H18M0 13H18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-bg px-6 py-4">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm text-text-body hover:bg-surface"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
