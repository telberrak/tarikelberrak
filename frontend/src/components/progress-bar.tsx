import { cn } from "@/lib/utils";

export function ProgressBar({
  percent,
  className,
  trackClassName,
}: {
  percent: number;
  className?: string;
  trackClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-alt", trackClassName, className)}
    >
      <div
        className="h-full rounded-full bg-teal transition-[width]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
