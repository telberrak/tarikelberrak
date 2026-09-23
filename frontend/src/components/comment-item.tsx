"use client";

import { useState } from "react";
import { CommentComposer } from "@/components/comment-composer";
import { formatRelativeTime } from "@/lib/utils";
import type { CommentTargetType, CommentWithAuthor } from "@/lib/types";

function Avatar({ name, url }: { name: string; url: string | null }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />;
  }
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-alt font-mono text-xs text-teal">
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function CommentItem({
  comment,
  replies,
  targetType,
  targetSlug,
  revalidate,
  canReply,
}: {
  comment: CommentWithAuthor;
  replies: CommentWithAuthor[];
  targetType: CommentTargetType;
  targetSlug: string;
  revalidate: string;
  canReply: boolean;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <div className="flex gap-3">
      <Avatar name={comment.author.displayName} url={comment.author.avatarUrl} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="text-sm font-semibold text-text-primary">{comment.author.displayName}</p>
          <p className="font-mono text-[11px] text-text-faint">
            {formatRelativeTime(comment.createdAt)}
          </p>
        </div>
        <p className="mt-1 whitespace-pre-wrap text-sm text-text-body">{comment.body}</p>

        {canReply && (
          <button
            onClick={() => setReplying((v) => !v)}
            className="mt-1.5 text-xs font-medium text-text-dim hover:text-teal"
          >
            {replying ? "Cancel" : "Reply"}
          </button>
        )}

        {replying && (
          <div className="mt-3">
            <CommentComposer
              targetType={targetType}
              targetSlug={targetSlug}
              parentId={comment.id}
              revalidate={revalidate}
              placeholder={`Reply to ${comment.author.displayName}…`}
              onPosted={() => setReplying(false)}
            />
          </div>
        )}

        {replies.length > 0 && (
          <div className="mt-4 space-y-4 border-l border-border-faint pl-4">
            {replies.map((reply) => (
              <div key={reply.id} className="flex gap-3">
                <Avatar name={reply.author.displayName} url={reply.author.avatarUrl} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-semibold text-text-primary">
                      {reply.author.displayName}
                    </p>
                    <p className="font-mono text-[11px] text-text-faint">
                      {formatRelativeTime(reply.createdAt)}
                    </p>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-text-body">{reply.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
