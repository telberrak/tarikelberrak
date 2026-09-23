"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export function UserMenu({
  displayName,
  avatarUrl,
  isAdmin,
}: {
  displayName: string;
  avatarUrl: string | null;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClickAway(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, []);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-border-faint py-1 pl-1 pr-3 text-sm text-text-body hover:border-border"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-alt font-mono text-[11px] text-teal">
            {initials}
          </span>
        )}
        <span className="max-w-[120px] truncate">{displayName}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 overflow-hidden rounded-[14px] border border-border bg-surface shadow-xl"
        >
          <Link
            href="/account"
            className="block px-4 py-2.5 text-sm text-text-body hover:bg-surface-alt"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            My Courses
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="block px-4 py-2.5 text-sm text-text-body hover:bg-surface-alt"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="block w-full px-4 py-2.5 text-left text-sm text-text-dim hover:bg-surface-alt"
            role="menuitem"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
