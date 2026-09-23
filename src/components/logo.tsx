import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-semibold text-text-primary">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal to-amber text-sm font-bold text-bg">
        TE
      </span>
      Tarik El Berrak
    </Link>
  );
}
