import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CourseForm } from "@/components/admin/course-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { ArchiveButton } from "@/components/admin/archive-button";
import { SectionRow } from "@/components/admin/section-row";
import { LessonRow } from "@/components/admin/lesson-row";
import { AddSectionForm } from "@/components/admin/add-section-form";
import { AddLessonForm } from "@/components/admin/add-lesson-form";
import {
  updateCourse,
  deleteCourse,
  setCourseArchived,
  createSection,
  updateSection,
  deleteSection,
  createLesson,
  updateLesson,
  deleteLesson,
} from "@/actions/admin-courses";
import { adminGetCourse } from "@/lib/admin";

export const metadata: Metadata = { title: "Edit course · Admin" };

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await adminGetCourse(id);
  if (!course) notFound();

  const sections = [...course.sections].sort((a, b) => a.position - b.position);
  const lessons = [...course.lessons].sort((a, b) => a.position - b.position);
  const ungrouped = lessons.filter((l) => !l.sectionId);

  const boundUpdateCourse = updateCourse.bind(null, id);
  const boundDeleteCourse = deleteCourse.bind(null, id);
  const boundArchive = setCourseArchived.bind(null, id, !course.archived, "/admin/courses");
  const boundCreateSection = createSection.bind(null, id);
  const boundCreateLesson = createLesson.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Edit course</h1>
        <div className="flex gap-2">
          <ArchiveButton
            action={boundArchive}
            archived={course.archived}
            confirmMessage={
              course.archived
                ? undefined
                : `Archive "${course.title}"? It will be hidden from the catalog and can no longer be purchased or joined; people already enrolled keep access.`
            }
          />
          <DeleteButton
            action={boundDeleteCourse}
            confirmMessage={`Delete "${course.title}"? This removes all its sections and lessons too.`}
          />
        </div>
      </div>
      {course.archived && (
        <p className="mt-4 rounded-[8px] border border-border bg-surface px-4 py-2.5 text-sm text-text-dim">
          This course is archived: hidden from the catalog and closed to new enrollments. Existing students keep access.
        </p>
      )}

      <div className="mt-6 max-w-4xl">
        <CourseForm action={boundUpdateCourse} initial={course} submitLabel="Save changes" />
      </div>

      <div className="mt-12 max-w-2xl">
        <h2 className="font-display text-xl font-semibold text-text-primary">Curriculum</h2>

        <div className="mt-4 space-y-6">
          {sections.map((section) => {
            const sectionLessons = lessons.filter((l) => l.sectionId === section.id);
            return (
              <div key={section.id} className="rounded-[14px] border border-border-faint bg-surface p-3">
                <SectionRow
                  section={section}
                  updateAction={updateSection.bind(null, id, section.id)}
                  deleteAction={deleteSection.bind(null, id, section.id)}
                />
                <div className="mt-2 space-y-1 pl-3">
                  {sectionLessons.map((lesson) => (
                    <LessonRow
                      key={lesson.id}
                      lesson={lesson}
                      sections={sections}
                      updateAction={updateLesson.bind(null, id, lesson.id)}
                      deleteAction={deleteLesson.bind(null, id, lesson.id)}
                    />
                  ))}
                  {sectionLessons.length === 0 && (
                    <p className="px-3 py-1 text-xs text-text-faint">No lessons in this section yet.</p>
                  )}
                </div>
              </div>
            );
          })}

          {ungrouped.length > 0 && (
            <div className="rounded-[14px] border border-border-faint bg-surface p-3">
              <p className="px-3 py-2 text-sm font-medium text-text-body">Ungrouped lessons</p>
              <div className="mt-1 space-y-1 pl-3">
                {ungrouped.map((lesson) => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    sections={sections}
                    updateAction={updateLesson.bind(null, id, lesson.id)}
                    deleteAction={deleteLesson.bind(null, id, lesson.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6" key={`add-section-${sections.length}`}>
          <AddSectionForm action={boundCreateSection} />
        </div>

        <div className="mt-4" key={`add-lesson-${lessons.length}`}>
          <AddLessonForm sections={sections} action={boundCreateLesson} />
        </div>
      </div>
    </div>
  );
}
