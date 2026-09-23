import Link from "next/link";
import { Hero } from "@/components/hero";
import { StatTileRow } from "@/components/stat-tile";
import { LabCard } from "@/components/lab-card";
import { ArticleTeaser } from "@/components/article-card";
import { getAllArticles } from "@/lib/articles";
import { getAllLabs } from "@/lib/labs";

const STATS = [
  { value: "20+", label: "Years in enterprise architecture" },
  { value: "3", label: "Global banks: UBS, HSBC, BNP Paribas" },
  { value: "12+", label: "AI & cloud labs published" },
  { value: "2", label: "Languages of education content: Darija & French" },
];

export default async function HomePage() {
  const [allLabs, allArticles] = await Promise.all([getAllLabs(), getAllArticles()]);
  const labs = allLabs.slice(0, 3);
  const articles = allArticles.slice(0, 3);

  return (
    <>
      <Hero
        eyebrow="Enterprise Architecture · AI Labs · Fintech Education"
        title="Turning complex financial systems into resilient, intelligent architecture."
        description="20+ years designing cloud, event-driven and AI-enabled platforms for global banks. Now sharing hands-on AI labs, technical writing, and financial education in English, French and Darija."
        primaryCta={{ href: "/labs", label: "View AI Labs" }}
        secondaryCta={{ href: "/articles", label: "Read Articles" }}
        credibility="Previously at UBS · HSBC · BNP Paribas"
      />

      <StatTileRow stats={STATS} />

      <section className="section-y">
        <div className="container-page">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold text-text-primary">
              Latest from the Labs
            </h2>
            <Link href="/labs" className="text-sm font-medium text-teal hover:underline">
              View all labs →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {labs.map((lab) => (
              <LabCard key={lab.slug} lab={lab} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-page">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold text-text-primary">
              From the Articles
            </h2>
            <Link href="/articles" className="text-sm font-medium text-teal hover:underline">
              View all articles →
            </Link>
          </div>
          <div className="mt-2">
            {articles.map((article) => (
              <ArticleTeaser key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-page">
          <div className="flex flex-col gap-6 rounded-[14px] border border-border-faint bg-surface p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-amber">
                Financial Education
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-text-primary">
                Learn markets and money, in Darija & French.
              </h2>
              <p className="mt-2 max-w-xl text-sm text-text-dim">
                Practical courses and explainers on trading, investing and financial literacy —
                made for Moroccan and French-speaking audiences.
              </p>
            </div>
            <Link
              href="/learn"
              className="shrink-0 rounded-[8px] bg-amber px-5 py-3 text-sm font-semibold text-amber-text hover:brightness-105"
            >
              Explore courses
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="pb-24">
        <div className="container-page">
          <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-start">
            <div className="flex h-56 items-center justify-center rounded-[14px] border border-border-faint bg-surface-alt font-mono text-xs text-text-faint md:h-full">
              [ PHOTO ]
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-text-primary">About</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-dim">
                I&apos;m an enterprise architect with 20+ years across major financial
                institutions, working hands-on with cloud platforms, Kubernetes, event-driven
                systems and data &amp; AI. I write, build labs and teach — in English, French and
                Darija.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Azure", "AWS", "Kubernetes", "Event-Driven Architecture", "DevSecFinOps", "Data & AI"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="font-mono inline-flex items-center rounded-full border border-border px-2.5 py-1 text-[11px] text-text-dim"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
