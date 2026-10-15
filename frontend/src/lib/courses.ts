import "server-only";
import { apiFetchOrNull } from "@/lib/api/client";
import type {
  CourseDetail,
  CourseSectionSummary,
  CourseSummary,
  EnrolledCourse,
  LessonDetail,
  LessonSummary,
} from "@/lib/types";

export async function getPublishedCourses(): Promise<CourseSummary[]> {
  const courses = await apiFetchOrNull<CourseSummary[]>("/api/courses", { auth: false });
  return courses ?? [];
}

export async function getCourseBySlug(slug: string): Promise<CourseDetail | null> {
  return apiFetchOrNull<CourseDetail>(`/api/courses/${slug}`, { auth: false });
}

export async function getCourseCurriculum(courseSlug: string): Promise<{
  sections: CourseSectionSummary[];
  lessons: LessonSummary[];
}> {
  const data = await apiFetchOrNull<{ sections: CourseSectionSummary[]; lessons: LessonSummary[] }>(
    `/api/courses/${courseSlug}/curriculum`,
  );
  return data ?? { sections: [], lessons: [] };
}

export async function getEnrollmentStatus(
  courseSlug: string,
): Promise<{ enrolled: boolean; source: string | null } | null> {
  return apiFetchOrNull<{ enrolled: boolean; source: string | null }>(
    `/api/enrollments/me/${courseSlug}`,
  );
}

export async function getLessonDetail(
  courseSlug: string,
  lessonSlug: string,
): Promise<LessonDetail | null> {
  return apiFetchOrNull<LessonDetail>(`/api/courses/${courseSlug}/lessons/${lessonSlug}`);
}

export async function getMyEnrolledCourses(): Promise<EnrolledCourse[]> {
  const data = await apiFetchOrNull<EnrolledCourse[]>("/api/enrollments/me");
  return data ?? [];
}
