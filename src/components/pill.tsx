import { cn } from "@/lib/utils";

export function Pill({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "teal" | "amber";
  className?: string;
}) {
  const tones: Record<string, string> = {
    default: "border-border text-text-dim",
    teal: "border-teal/40 text-teal",
    amber: "border-amber/40 text-amber",
  };

  return (
    <span
      className={cn(
        "font-mono inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
