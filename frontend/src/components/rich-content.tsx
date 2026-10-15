import { MDXRemote } from "next-mdx-remote/rsc";
import { articleMdxComponents } from "@/components/mdx-components";
import { sanitizeRichHtml } from "@/lib/sanitize";
import type { ContentFormat } from "@/lib/types";

// Rows created before the rich-text editor hold Markdown; everything saved
// from the editor holds HTML. Both render into the same visual style.
export function RichContent({ content, format }: { content: string; format: ContentFormat }) {
  if (format === "markdown") {
    return <MDXRemote source={content} components={articleMdxComponents} />;
  }
  return <div className="rich-content" dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(content) }} />;
}
