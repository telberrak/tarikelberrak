import Link from "next/link";
import { cn, formatDuration } from "@/lib/utils";
import type { CourseSectionSummary, LessonSummary } from "@/lib/types";

function CheckIcon({ completed }: { completed: boolean }) {
  if (completed) {
    return (
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 shrink-0">
        <circle cx="10" cy="10" r="9" fill="var(--color-teal)" />
        <path d="M6 10.5 L9 13.5 L14 7.5" stroke="var(--color-bg)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 shrink-0">
      <circle cx="10" cy="10" r="8.25" stroke="var(--color-border)" strokeWidth="1.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 shrink-0 text-text-faint">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function CurriculumList({
  courseSlug,
  sections,
  lessons,
  activeLessonId,
  isEnrolled,
}: {
  courseSlug: string;
  sections: CourseSectionSummary[];
  lessons: LessonSummary[];
  activeLessonId?: string;
  isEnrolled: boolean;
}) {
  const grouped = sections
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((section) => ({
      section,
      lessons: lessons.filter((l) => l.sectionId === section.id).sort((a, b) => a.position - b.position),
    }));

  const ungrouped = lessons.filter((l) => !l.sectionId).sort((a, b) => a.position - b.position);

  const renderLesson = (lesson: LessonSummary) => {
    const unlocked = isEnrolled || lesson.isPreview;
    const completed = lesson.completed;
    const isActive = lesson.id === activeLessonId;
    const href = unlocked ? `/learn/${courseSlug}/learn/${lesson.slug}` : `/learn/${courseSlug}`;

    return (
      <li key={lesson.id}>
        <Link
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm transition-colors",
            isActive ? "bg-surface-alt text-text-primary" : "text-text-dim hover:bg-surface-alt/60",
            !unlocked && "text-text-faint",
          )}
        >
          <CheckIcon completed={completed} />
          <span className="flex-1 truncate">{lesson.title}</span>
          {!unlocked && <LockIcon />}
          <span className="font-mono text-[11px] text-text-faint">
            {formatDuration(lesson.durationSeconds)}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <nav aria-label="Course curriculum" className="text-sm">
      {grouped.map(({ section, lessons: sectionLessons }) => (
        <div key={section.id} className="mb-4">
          <p className="px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-text-faint">
            {section.title}
          </p>
          <ul className="space-y-0.5">{sectionLessons.map(renderLesson)}</ul>
        </div>
      ))}

      {ungrouped.length > 0 && (
        <div>
          {grouped.length > 0 && (
            <p className="px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-text-faint">
              More lessons
            </p>
          )}
          <ul className="space-y-0.5">{ungrouped.map(renderLesson)}</ul>
        </div>
      )}
    </nav>
  );
}
