"use client";

import { useMemo, useState } from "react";
import { FilterPills } from "@/components/filter-pills";
import { LabCard } from "@/components/lab-card";
import type { LabFrontmatter } from "@/lib/types";

const CATEGORIES = ["All", "AI & LLM", "Cloud & Kubernetes", "Trading & Quant", "Event-Driven"].map(
  (c) => ({ value: c, label: c }),
);

export function LabsExplorer({ labs }: { labs: LabFrontmatter[] }) {
  const [active, setActive] = useState("All");

  const filtered = useMemo(
    () => (active === "All" ? labs : labs.filter((lab) => lab.category === active)),
    [labs, active],
  );

  return (
    <div>
      <FilterPills options={CATEGORIES} active={active} onChange={setActive} />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((lab) => (
          <LabCard key={lab.slug} lab={lab} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-text-dim">No labs in this category yet.</p>
      )}
    </div>
  );
}
