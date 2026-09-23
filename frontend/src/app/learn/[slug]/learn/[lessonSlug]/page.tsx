import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { ProgressBar } from "@/components/progress-bar";
import { CurriculumList } from "@/components/curriculum-list";
import { CommentThread } from "@/components/comment-thread";
import { VideoPlayer } from "@/components/video-player";
import { getCourseBySlug, getCourseCurriculum, getEnrollmentStatus, getLessonDetail } from "@/lib/courses";
import { getCurrentUser } from "@/lib/auth";
import { formatDuration } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return { title: `${lessonSlug.replace(/-/g, " ")} · ${course.title}` };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/learn/${slug}/learn/${lessonSlug}`);

  const lesson = await getLessonDetail(slug, lessonSlug);
  if (!lesson) redirect(`/learn/${slug}`);

  const [{ sections, lessons }, enrollment] = await Promise.all([
    getCourseCurriculum(slug),
    getEnrollmentStatus(slug),
  ]);
  const isEnrolled = Boolean(enrollment?.enrolled);

  const sorted = [...lessons].sort((a, b) => a.position - b.position);
  const completedCount = sorted.filter((l) => l.completed).length;
  const coursePercent = sorted.length > 0 ? (completedCount / sorted.length) * 100 : 0;

  const prevLesson = lesson.previousLessonSlug
    ? sorted.find((l) => l.slug === lesson.previousLessonSlug)
    : null;
  const nextLesson = lesson.nextLessonSlug
    ? sorted.find((l) => l.slug === lesson.nextLessonSlug)
    : null;

  return (
    <div className="grid lg:grid-cols-[320px_1fr]">
      <aside className="border-b border-border-faint bg-surface/40 px-4 py-6 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <Link href={`/learn/${slug}`} className="text-sm font-medium text-text-dim hover:text-text-primary">
          ← {course.title}
        </Link>

        <div className="mt-4">
          <div className="mb-1.5 flex justify-between font-mono text-[11px] text-text-faint">
            <span>Course progress</span>
            <span>
              {completedCount}/{sorted.length} · {Math.round(coursePercent)}%
            </span>
          </div>
          <ProgressBar percent={coursePercent} />
        </div>

        <div className="mt-6">
          <CurriculumList
            courseSlug={slug}
            sections={sections}
            lessons={sorted}
            activeLessonId={lesson.id}
            isEnrolled={isEnrolled}
          />
        </div>
      </aside>

      <main className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-3xl">
          {lesson.asset ? (
            <VideoPlayer
              lessonId={lesson.id}
              courseSlug={slug}
              provider={lesson.asset.provider}
              assetId={lesson.asset.videoAssetId}
              initialWatchedSeconds={lesson.watchedSeconds}
              durationSeconds={lesson.durationSeconds}
              initialCompleted={lesson.completed}
            />
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-[14px] border border-border-faint bg-surface text-sm text-text-faint">
              Video not yet available for this lesson.
            </div>
          )}

          <h1 className="mt-6 font-display text-2xl font-semibold text-text-primary">
            {lesson.title}
          </h1>
          <p className="mt-1 font-mono text-xs text-text-faint">
            {formatDuration(lesson.durationSeconds)}
          </p>

          {lesson.notes && (
            <div className="mt-4 rounded-[14px] border border-border-faint bg-surface p-5 text-sm leading-relaxed text-text-dim">
              {lesson.notes}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-border-faint pt-6">
            {prevLesson ? (
              <Link
                href={`/learn/${slug}/learn/${prevLesson.slug}`}
                className="text-sm font-medium text-text-dim hover:text-text-primary"
              >
                ← {prevLesson.title}
              </Link>
            ) : (
              <span />
            )}
            {nextLesson ? (
              <Link
                href={`/learn/${slug}/learn/${nextLesson.slug}`}
                className="text-sm font-medium text-teal hover:underline"
              >
                {nextLesson.title} →
              </Link>
            ) : (
              <span className="text-sm text-text-faint">You&apos;ve reached the end of the course</span>
            )}
          </div>

          <CommentThread
            targetType="lesson"
            targetSlug={lesson.slug}
            revalidate={`/learn/${slug}/learn/${lessonSlug}`}
            isSignedIn={Boolean(user)}
          />
        </div>
      </main>
    </div>
  );
}
