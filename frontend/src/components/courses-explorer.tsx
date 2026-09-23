"use client";

import { useMemo, useState } from "react";
import { FilterPills } from "@/components/filter-pills";
import { CourseCard } from "@/components/course-card";
import type { CourseSummary } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  trading: "Trading Basics",
  investing: "Investing",
  literacy: "Financial Literacy",
  crypto: "Crypto & Markets",
};

export function CoursesExplorer({ courses }: { courses: CourseSummary[] }) {
  const categories = useMemo(() => {
    const unique = Array.from(new Set(courses.map((c) => c.category)));
    return ["All", ...unique].map((value) => ({
      value,
      label: value === "All" ? "All courses" : (CATEGORY_LABELS[value] ?? value),
    }));
  }, [courses]);

  const [active, setActive] = useState("All");

  const filtered = useMemo(
    () => (active === "All" ? courses : courses.filter((c) => c.category === active)),
    [courses, active],
  );

  return (
    <div>
      <FilterPills
        options={categories}
        active={active}
        onChange={setActive}
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-text-dim">No courses in this category yet.</p>
      )}
    </div>
  );
}

export { CATEGORY_LABELS };
