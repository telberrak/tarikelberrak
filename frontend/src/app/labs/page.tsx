import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { LabsExplorer } from "@/components/labs-explorer";
import { getAllLabs } from "@/lib/labs";

export const metadata: Metadata = {
  title: "AI & Cloud Labs",
  description: "Working experiments in architecture, AI and quantitative systems.",
};

export default async function LabsPage() {
  const labs = await getAllLabs();

  return (
    <>
      <Hero
        eyebrow="AI & Cloud Labs"
        title="Working experiments in architecture, AI and quantitative systems."
        description="Each lab is a real build, not a slide deck — code, findings and what I'd do differently next time."
      />
      <div className="container-page pb-24">
        <LabsExplorer labs={labs} />
      </div>
    </>
  );
}
