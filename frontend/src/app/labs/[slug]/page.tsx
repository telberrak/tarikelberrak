import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { IconTile } from "@/components/icon-tile";
import { Pill } from "@/components/pill";
import { CommentThread } from "@/components/comment-thread";
import { RichContent } from "@/components/rich-content";
import { Paywall } from "@/components/paywall";
import { getLabBySlug } from "@/lib/labs";
import { getCurrentUser } from "@/lib/auth";
import type { LabFrontmatter } from "@/lib/types";

const statusTone: Record<LabFrontmatter["status"], "teal" | "amber" | "default"> = {
  Live: "teal",
  "In Progress": "amber",
  "Case Study": "default",
  Prototype: "default",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lab = await getLabBySlug(slug);
  if (!lab) return {};
  return { title: lab.title, description: lab.excerpt };
}

export default async function LabPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { slug } = await params;
  const { checkout } = await searchParams;
  const lab = await getLabBySlug(slug);
  if (!lab) notFound();

  const user = await getCurrentUser();
  const path = `/labs/${slug}`;

  return (
    <article className="section-y">
      <div className="container-page">
        <div className="mx-auto max-w-3xl">
          <IconTile icon={lab.icon} className="rounded-[14px] border" />

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Pill tone={statusTone[lab.status]}>{lab.status}</Pill>
            <Pill>{lab.category}</Pill>
          </div>

          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-text-primary md:text-4xl">
            {lab.title}
          </h1>
          <p className="mt-3 text-lg text-text-dim">{lab.excerpt}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {lab.tags.map((tag) => (
              <Pill key={tag} tone="teal">
                {tag}
              </Pill>
            ))}
          </div>

          <hr className="my-8 border-border-faint" />

          {checkout === "success" && !lab.locked && (
            <div className="mb-6 rounded-[14px] border border-teal/30 bg-surface px-4 py-3 text-sm text-teal">
              Payment received — thanks! This lab is now unlocked.
            </div>
          )}
          {checkout === "success" && lab.locked && (
            <div className="mb-6 rounded-[14px] border border-border-faint bg-surface px-4 py-3 text-sm text-text-dim">
              Payment received — unlocking can take a few seconds. Refresh this page if it still looks locked.
            </div>
          )}

          {lab.locked ? (
            <Paywall kind="lab" slug={slug} priceCents={lab.priceCents} isSignedIn={Boolean(user)} />
          ) : (
            <div className="prose-article">
              <RichContent content={lab.content} format={lab.contentFormat} />
            </div>
          )}

          <CommentThread
            targetType="lab"
            targetSlug={slug}
            revalidate={path}
            isSignedIn={Boolean(user)}
          />
        </div>
      </div>
    </article>
  );
}
