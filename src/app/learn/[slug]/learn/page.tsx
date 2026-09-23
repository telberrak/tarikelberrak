import { notFound, redirect } from "next/navigation";
import { getCourseBySlug, getCourseCurriculum, getEnrollmentStatus } from "@/lib/courses";
import { getCurrentUser } from "@/lib/auth";

export default async function CoursePlayerEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/learn/${slug}/learn`);

  const enrollment = await getEnrollmentStatus(slug);
  if (!enrollment?.enrolled) redirect(`/learn/${slug}`);

  const { lessons } = await getCourseCurriculum(slug);
  if (lessons.length === 0) redirect(`/learn/${slug}`);

  const sorted = [...lessons].sort((a, b) => a.position - b.position);
  const nextIncomplete = sorted.find((l) => !l.completed);
  const target = nextIncomplete ?? sorted[0];

  redirect(`/learn/${slug}/learn/${target.slug}`);
}
