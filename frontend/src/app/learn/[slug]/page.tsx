import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Pill } from "@/components/pill";
import { CurriculumList } from "@/components/curriculum-list";
import { CommentThread } from "@/components/comment-thread";
import { RichContent } from "@/components/rich-content";
import { enrollFree } from "@/actions/enroll";
import { createCheckoutSession } from "@/actions/checkout";
import { getCourseBySlug, getCourseCurriculum, getEnrollmentStatus } from "@/lib/courses";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return { title: course.title, description: course.description };
}

export default async function CourseLandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { slug } = await params;
  const { checkout } = await searchParams;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const user = await getCurrentUser();
  const { sections, lessons } = await getCourseCurriculum(slug);
  const enrollment = user ? await getEnrollmentStatus(slug) : null;
  const isEnrolled = Boolean(enrollment?.enrolled);

  const totalDuration = lessons.reduce((sum, l) => sum + l.durationSeconds, 0);
  const totalMinutes = Math.round(totalDuration / 60);

  return (
    <div className="section-y">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {checkout === "success" && (
            <div className="mb-6 rounded-[14px] border border-teal/30 bg-surface px-4 py-3 text-sm text-teal">
              Payment received — you now have full access to this course.
            </div>
          )}
          {checkout === "cancelled" && (
            <div className="mb-6 rounded-[14px] border border-border-faint bg-surface px-4 py-3 text-sm text-text-dim">
              Checkout was cancelled. You can try again whenever you&apos;re ready.
            </div>
          )}

          <Pill tone={course.level === "beginner" ? "teal" : "amber"} className="capitalize">
            {course.level}
          </Pill>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-text-primary md:text-4xl">
            {course.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-text-dim">{course.description}</p>
          <p className="mt-3 font-mono text-xs uppercase tracking-wide text-text-faint">
            {lessons.length} lessons · {totalMinutes} min total
          </p>

          {course.content.trim() && (
            <div className="mt-10">
              <RichContent content={course.content} format="html" />
            </div>
          )}

          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold text-text-primary">Curriculum</h2>
            <div className="mt-4 rounded-[14px] border border-border-faint bg-surface p-2">
              <CurriculumList
                courseSlug={slug}
                sections={sections}
                lessons={lessons}
                isEnrolled={isEnrolled}
              />
            </div>
          </div>

          <CommentThread
            targetType="course"
            targetSlug={slug}
            revalidate={`/learn/${slug}`}
            isSignedIn={Boolean(user)}
          />
        </div>

        <aside className="h-fit rounded-[14px] border border-border-faint bg-surface p-6 lg:sticky lg:top-24">
          <p className="font-display text-3xl font-semibold text-text-primary">
            {formatPrice(course.priceCents)}
          </p>

          {isEnrolled ? (
            <Link
              href={`/learn/${slug}/learn`}
              className="mt-5 block w-full rounded-[8px] bg-amber px-5 py-3 text-center text-sm font-semibold text-amber-text hover:brightness-105"
            >
              Continue learning
            </Link>
          ) : course.isFree ? (
            <form action={enrollFree.bind(null, slug)}>
              <button
                type="submit"
                className="mt-5 w-full rounded-[8px] bg-amber px-5 py-3 text-sm font-semibold text-amber-text hover:brightness-105"
              >
                Enroll for free
              </button>
            </form>
          ) : (
            <form action={createCheckoutSession.bind(null, slug)}>
              <button
                type="submit"
                className="mt-5 w-full rounded-[8px] bg-amber px-5 py-3 text-sm font-semibold text-amber-text hover:brightness-105"
              >
                Buy for {formatPrice(course.priceCents)}
              </button>
            </form>
          )}

          <ul className="mt-6 space-y-2 text-sm text-text-dim">
            <li>· {lessons.length} lessons, lifetime access</li>
            <li>· Progress tracking across devices</li>
            <li>· Comments on every lesson</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
