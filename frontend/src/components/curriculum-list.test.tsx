import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CurriculumList } from "@/components/curriculum-list";
import type { LessonSummary } from "@/lib/types";

function lesson(overrides: Partial<LessonSummary>): LessonSummary {
  return {
    id: "lesson-1",
    sectionId: null,
    slug: "lesson-1",
    title: "Lesson 1",
    position: 0,
    durationSeconds: 120,
    isPreview: false,
    completed: false,
    watchedSeconds: 0,
    ...overrides,
  };
}

describe("CurriculumList", () => {
  it("links a locked, non-enrolled, non-preview lesson to the course page, not the lesson", () => {
    render(
      <CurriculumList
        courseSlug="my-course"
        sections={[]}
        lessons={[lesson({ id: "l1", slug: "intro", title: "Intro", isPreview: false })]}
        isEnrolled={false}
      />,
    );

    const link = screen.getByRole("link", { name: /intro/i });
    expect(link).toHaveAttribute("href", "/learn/my-course");
  });

  it("links an unlocked preview lesson straight to the lesson, even when not enrolled", () => {
    render(
      <CurriculumList
        courseSlug="my-course"
        sections={[]}
        lessons={[lesson({ id: "l1", slug: "intro", title: "Intro", isPreview: true })]}
        isEnrolled={false}
      />,
    );

    const link = screen.getByRole("link", { name: /intro/i });
    expect(link).toHaveAttribute("href", "/learn/my-course/learn/intro");
  });

  it("unlocks every lesson once the viewer is enrolled, preview or not", () => {
    render(
      <CurriculumList
        courseSlug="my-course"
        sections={[]}
        lessons={[lesson({ id: "l1", slug: "advanced", title: "Advanced", isPreview: false })]}
        isEnrolled={true}
      />,
    );

    const link = screen.getByRole("link", { name: /advanced/i });
    expect(link).toHaveAttribute("href", "/learn/my-course/learn/advanced");
  });

  it("groups lessons under their section heading", () => {
    render(
      <CurriculumList
        courseSlug="my-course"
        sections={[{ id: "s1", title: "Introduction", position: 0 }]}
        lessons={[lesson({ id: "l1", slug: "intro", title: "Intro", sectionId: "s1", isPreview: true })]}
        isEnrolled={false}
      />,
    );

    expect(screen.getByText("Introduction")).toBeInTheDocument();
  });
});
