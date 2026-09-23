"use client";

import { useActionState, useEffect, useRef } from "react";
import { postComment, type CommentFormState } from "@/actions/comments";
import type { CommentTargetType } from "@/lib/types";

const initialState: CommentFormState = { status: "idle" };

export function CommentComposer({
  targetType,
  targetSlug,
  parentId = null,
  revalidate,
  placeholder = "Add to the discussion…",
  onPosted,
}: {
  targetType: CommentTargetType;
  targetSlug: string;
  parentId?: string | null;
  revalidate: string;
  placeholder?: string;
  onPosted?: () => void;
}) {
  const [state, formAction, pending] = useActionState(postComment, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      onPosted?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="targetType" value={targetType} />
      <input type="hidden" name="targetSlug" value={targetSlug} />
      <input type="hidden" name="parentId" value={parentId ?? ""} />
      <input type="hidden" name="revalidate" value={revalidate} />
      <label htmlFor={`comment-${parentId ?? "root"}`} className="sr-only">
        Comment
      </label>
      <textarea
        id={`comment-${parentId ?? "root"}`}
        name="body"
        required
        minLength={2}
        rows={parentId ? 2 : 3}
        placeholder={placeholder}
        className="w-full resize-none rounded-[8px] border border-border bg-surface px-3.5 py-2.5 text-sm text-text-body placeholder:text-text-faint focus:border-teal"
      />
      <div className="flex items-center justify-between">
        {state.status === "error" && <p className="text-xs text-red-400">{state.message}</p>}
        <button
          type="submit"
          disabled={pending}
          className="ml-auto rounded-[8px] bg-amber px-4 py-2 text-sm font-semibold text-amber-text disabled:opacity-60"
        >
          {pending ? "Posting…" : parentId ? "Reply" : "Post comment"}
        </button>
      </div>
    </form>
  );
}
