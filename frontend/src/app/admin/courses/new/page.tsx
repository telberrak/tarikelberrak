import type { Metadata } from "next";
import { CourseForm } from "@/components/admin/course-form";
import { createCourse } from "@/actions/admin-courses";

export const metadata: Metadata = { title: "New course · Admin" };

export default function NewCoursePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">New course</h1>
      <p className="mt-2 text-sm text-text-dim">
        You&apos;ll add sections and lessons on the next screen, once the course exists.
      </p>
      <div className="mt-6 max-w-4xl">
        <CourseForm action={createCourse} submitLabel="Create course" />
      </div>
    </div>
  );
}
