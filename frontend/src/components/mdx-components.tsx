import type { ComponentPropsWithoutRef } from "react";

export const articleMdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-10 mb-4 font-display text-2xl font-semibold text-text-primary" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-8 mb-3 font-display text-xl font-semibold text-text-primary" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-5 font-article text-[17px] leading-[1.75] text-text-body" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-5 ml-5 list-disc space-y-2 font-article text-[17px] text-text-body" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-5 ml-5 list-decimal space-y-2 font-article text-[17px] text-text-body" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-6 border-l-2 border-amber pl-5 font-article text-lg italic text-text-primary"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="mb-6 overflow-x-auto rounded-[14px] border border-border-faint bg-surface p-5 font-mono text-[13px] leading-relaxed text-text-body"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code className="font-mono text-[0.9em]" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a className="text-teal underline underline-offset-2" {...props} />
  ),
};
