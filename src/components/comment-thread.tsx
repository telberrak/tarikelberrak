import Link from "next/link";
import { getComments } from "@/actions/comments";
import { CommentComposer } from "@/components/comment-composer";
import { CommentItem } from "@/components/comment-item";
import type { CommentTargetType } from "@/lib/types";

export async function CommentThread({
  targetType,
  targetSlug,
  revalidate,
  isSignedIn,
}: {
  targetType: CommentTargetType;
  targetSlug: string;
  revalidate: string;
  isSignedIn: boolean;
}) {
  const comments = await getComments(targetType, targetSlug);
  const topLevel = comments.filter((c) => !c.parentId);
  const repliesByParent = new Map<string, typeof comments>();
  for (const c of comments) {
    if (c.parentId) {
      repliesByParent.set(c.parentId, [...(repliesByParent.get(c.parentId) ?? []), c]);
    }
  }

  return (
    <section aria-labelledby="comments-heading" className="mt-16">
      <h2 id="comments-heading" className="font-display text-xl font-semibold text-text-primary">
        Comments {comments.length > 0 && <span className="text-text-faint">({comments.length})</span>}
      </h2>

      <div className="mt-6">
        {isSignedIn ? (
          <CommentComposer targetType={targetType} targetSlug={targetSlug} revalidate={revalidate} />
        ) : (
          <div className="rounded-[14px] border border-border-faint bg-surface px-4 py-3.5 text-sm text-text-dim">
            <Link href={`/login?next=${revalidate}`} className="font-medium text-teal hover:underline">
              Sign in
            </Link>{" "}
            to join the discussion.
          </div>
        )}
      </div>

      <div className="mt-8 space-y-8">
        {topLevel.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={repliesByParent.get(comment.id) ?? []}
            targetType={targetType}
            targetSlug={targetSlug}
            revalidate={revalidate}
            canReply={isSignedIn}
          />
        ))}

        {topLevel.length === 0 && (
          <p className="text-sm text-text-dim">Be the first to comment.</p>
        )}
      </div>
    </section>
  );
}
