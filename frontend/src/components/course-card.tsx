import Link from "next/link";
import { Pill } from "@/components/pill";
import { ProgressBar } from "@/components/progress-bar";
import { formatPrice } from "@/lib/utils";
import type { CourseSummary } from "@/lib/types";

export function CourseCard({
  course,
  progressPercent,
}: {
  course: CourseSummary;
  progressPercent?: number;
}) {
  return (
    <Link
      href={`/learn/${course.slug}`}
      className="group flex flex-col rounded-[14px] border border-border-faint bg-surface p-5 transition-colors hover:border-border"
    >
      <div className="flex items-center justify-between gap-2">
        <Pill tone={course.level === "beginner" ? "teal" : "amber"} className="capitalize">
          {course.level}
        </Pill>
        <span
          className={`font-mono text-xs font-semibold ${
            course.isFree ? "text-teal" : "text-amber"
          }`}
        >
          {formatPrice(course.priceCents)}
        </span>
      </div>

      <h3 className="mt-3 font-display text-lg font-semibold text-text-primary group-hover:text-teal">
        {course.title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-text-dim">{course.description}</p>

      {typeof progressPercent === "number" ? (
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between font-mono text-[11px] text-text-faint">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <ProgressBar percent={progressPercent} />
        </div>
      ) : (
        <p className="mt-4 font-mono text-xs uppercase tracking-wide text-text-faint">
          {course.category}
        </p>
      )}
    </Link>
  );
}
