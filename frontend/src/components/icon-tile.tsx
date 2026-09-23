import type { IconKey } from "@/lib/types";

const icons: Record<IconKey, React.ReactNode> = {
  bars: (
    <svg viewBox="0 0 48 32" fill="none" className="h-8 w-12">
      <rect x="2" y="18" width="6" height="12" rx="1.5" fill="var(--color-teal)" />
      <rect x="12" y="10" width="6" height="20" rx="1.5" fill="var(--color-teal)" opacity="0.7" />
      <rect x="22" y="14" width="6" height="16" rx="1.5" fill="var(--color-amber)" />
      <rect x="32" y="4" width="6" height="26" rx="1.5" fill="var(--color-teal)" />
      <rect x="42" y="20" width="4" height="10" rx="1.5" fill="var(--color-amber)" opacity="0.7" />
    </svg>
  ),
  network: (
    <svg viewBox="0 0 48 32" fill="none" className="h-8 w-12">
      <circle cx="8" cy="16" r="4" fill="var(--color-teal)" />
      <circle cx="24" cy="6" r="3" fill="var(--color-amber)" />
      <circle cx="24" cy="26" r="3" fill="var(--color-amber)" />
      <circle cx="40" cy="16" r="4" fill="var(--color-teal)" />
      <path
        d="M11 15 L21 8 M11 17 L21 24 M27 8 L37 15 M27 24 L37 17"
        stroke="var(--color-text-faint)"
        strokeWidth="1.5"
      />
    </svg>
  ),
  hexagons: (
    <svg viewBox="0 0 48 32" fill="none" className="h-8 w-12">
      <polygon
        points="16,4 26,10 26,22 16,28 6,22 6,10"
        stroke="var(--color-teal)"
        strokeWidth="2"
        fill="none"
      />
      <polygon
        points="32,4 42,10 42,22 32,28 22,22 22,10"
        stroke="var(--color-amber)"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  ),
  toggle: (
    <svg viewBox="0 0 48 32" fill="none" className="h-8 w-12">
      <rect x="4" y="6" width="18" height="18" rx="9" stroke="var(--color-teal)" strokeWidth="2" />
      <path d="M13 11 L13 19 M9 15 L17 15" stroke="var(--color-teal)" strokeWidth="2" />
      <rect x="26" y="6" width="18" height="18" rx="9" stroke="var(--color-amber)" strokeWidth="2" />
      <path d="M31 15 L39 15" stroke="var(--color-amber)" strokeWidth="2" />
    </svg>
  ),
  rings: (
    <svg viewBox="0 0 48 32" fill="none" className="h-8 w-12">
      <circle cx="18" cy="16" r="9" stroke="var(--color-teal)" strokeWidth="2" />
      <circle cx="30" cy="16" r="9" stroke="var(--color-amber)" strokeWidth="2" />
    </svg>
  ),
  wave: (
    <svg viewBox="0 0 48 32" fill="none" className="h-8 w-12">
      <path
        d="M2 20 Q10 6 18 20 T34 20 T46 20"
        stroke="var(--color-teal)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M2 24 Q10 14 18 24 T34 24 T46 24"
        stroke="var(--color-amber)"
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
    </svg>
  ),
};

export function IconTile({ icon, className }: { icon: string; className?: string }) {
  const key = (icon in icons ? icon : "bars") as IconKey;
  return (
    <div
      className={`flex h-28 items-center justify-center rounded-t-[14px] border-b border-border-faint bg-surface-alt ${className ?? ""}`}
    >
      {icons[key]}
    </div>
  );
}
