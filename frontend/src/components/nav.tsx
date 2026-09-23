import Link from "next/link";
import { Logo } from "@/components/logo";
import { UserMenu } from "@/components/user-menu";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/labs", label: "Labs" },
  { href: "/articles", label: "Articles" },
  { href: "/learn", label: "Learn" },
  { href: "/contact", label: "Contact" },
];

export function Nav({
  user,
}: {
  user: { displayName: string; avatarUrl: string | null; isAdmin: boolean } | null;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-border-faint bg-bg/80 backdrop-blur">
      <div className="container-page relative flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-text-dim transition-colors hover:text-text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          {user ? (
            <UserMenu displayName={user.displayName} avatarUrl={user.avatarUrl} isAdmin={user.isAdmin} />
          ) : (
            <>
              <Link href="/login" className="text-sm text-text-dim hover:text-text-primary">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-[8px] bg-amber px-4 py-2 text-sm font-semibold text-amber-text hover:brightness-105"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
