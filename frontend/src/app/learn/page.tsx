import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { CoursesExplorer } from "@/components/courses-explorer";
import { getPublishedCourses } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Learn",
  description: "Plain-language courses on trading, investing and financial literacy.",
};

export default async function LearnPage() {
  const courses = await getPublishedCourses();

  return (
    <>
      <Hero
        eyebrow="Financial Education"
        eyebrowTone="amber"
        title="Learn markets and money, in Darija & French."
        description="Plain-language courses on trading, investing and financial literacy, built for Moroccan and French-speaking audiences. Most lessons are also available as a Darija voice-over."
      />
      <div className="container-page pb-24">
        <CoursesExplorer courses={courses} />
      </div>
    </>
  );
}
