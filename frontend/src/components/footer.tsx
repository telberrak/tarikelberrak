import Link from "next/link";

const siteLinks = [
  { href: "/", label: "Home" },
  { href: "/labs", label: "Labs" },
  { href: "/articles", label: "Articles" },
  { href: "/learn", label: "Learn" },
];

const connectLinks = [
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://github.com", label: "GitHub" },
  { href: "mailto:tarik.elberrak@gmail.com", label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-faint">
      <div className="container-page flex flex-col gap-10 py-16 md:flex-row md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-text-primary">Tarik El Berrak</p>
          <p className="mt-1 text-sm text-text-dim">
            Enterprise Architect · AI Labs · Fintech Education
          </p>
        </div>

        <div className="flex gap-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-text-faint">Site</p>
            <ul className="mt-3 space-y-2">
              {siteLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-text-dim hover:text-text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-text-faint">Connect</p>
            <ul className="mt-3 space-y-2">
              {connectLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-text-dim hover:text-text-primary">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border-faint py-6">
        <div className="container-page flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-text-faint">
            © {new Date().getFullYear()} Tarik El Berrak. Built with care.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="font-mono text-xs text-text-faint hover:text-text-dim">
              Terms
            </Link>
            <Link href="/privacy" className="font-mono text-xs text-text-faint hover:text-text-dim">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
