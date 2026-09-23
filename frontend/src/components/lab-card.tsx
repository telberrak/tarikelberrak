import Link from "next/link";
import { IconTile } from "@/components/icon-tile";
import { Pill } from "@/components/pill";
import type { LabFrontmatter } from "@/lib/types";

const statusTone: Record<LabFrontmatter["status"], "teal" | "amber" | "default"> = {
  Live: "teal",
  "In Progress": "amber",
  "Case Study": "default",
  Prototype: "default",
};

export function LabCard({ lab }: { lab: LabFrontmatter }) {
  return (
    <Link
      href={`/labs/${lab.slug}`}
      className="group flex flex-col overflow-hidden rounded-[14px] border border-border-faint bg-surface transition-colors hover:border-border"
    >
      <IconTile icon={lab.icon} />
      <div className="flex flex-1 flex-col p-5">
        <Pill tone={statusTone[lab.status]} className="self-start">
          {lab.status}
        </Pill>
        <h3 className="mt-3 font-display text-lg font-semibold text-text-primary group-hover:text-teal">
          {lab.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-text-dim">{lab.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {lab.tags.map((tag) => (
            <Pill key={tag}>{tag}</Pill>
          ))}
        </div>
      </div>
    </Link>
  );
}
