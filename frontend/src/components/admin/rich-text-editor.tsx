"use client";

import { useState, type ReactNode } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { marked } from "marked";

// Mid-tone colours that stay readable on both the light and dark themes.
const COLORS = [
  { name: "Teal", value: "#0e9f8e" },
  { name: "Amber", value: "#d98a1f" },
  { name: "Red", value: "#e5484d" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Green", value: "#22a06b" },
  { name: "Pink", value: "#ec4899" },
  { name: "Gray", value: "#8b95a5" },
];

const HIGHLIGHTS = [
  { name: "Yellow", value: "#fde68a" },
  { name: "Green", value: "#a7f3d0" },
  { name: "Blue", value: "#bfdbfe" },
  { name: "Pink", value: "#fbcfe8" },
  { name: "Orange", value: "#fed7aa" },
];

const SIZES = [
  { label: "Small", value: "14px" },
  { label: "Normal", value: "" },
  { label: "Large", value: "22px" },
  { label: "Huge", value: "30px" },
];

function ToolButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-8 min-w-8 items-center justify-center rounded-[6px] px-2 text-sm transition-colors disabled:opacity-40 ${
        active ? "bg-teal text-bg" : "text-text-body hover:bg-surface-alt"
      }`}
    >
      {children}
    </button>
  );
}

function Swatches({
  label,
  colors,
  onPick,
  onClear,
}: {
  label: string;
  colors: { name: string; value: string }[];
  onPick: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label={label}>
      <span className="px-1 font-mono text-[11px] uppercase text-text-faint">{label}</span>
      {colors.map((c) => (
        <button
          key={c.value}
          type="button"
          title={`${label}: ${c.name}`}
          aria-label={`${label} ${c.name}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onPick(c.value)}
          className="h-5 w-5 rounded-full border border-border"
          style={{ backgroundColor: c.value }}
        />
      ))}
      <input
        type="color"
        aria-label={`${label} custom`}
        title={`${label}: custom`}
        onChange={(e) => onPick(e.target.value)}
        className="h-6 w-6 cursor-pointer rounded border border-border bg-transparent p-0"
      />
      <button
        type="button"
        title={`Remove ${label.toLowerCase()}`}
        aria-label={`Remove ${label.toLowerCase()}`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClear}
        className="rounded px-1.5 text-xs text-text-dim hover:bg-surface-alt"
      >
        ✕
      </button>
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (leave empty to remove)", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const currentSize = (editor.getAttributes("textStyle").fontSize as string | undefined) ?? "";

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border bg-surface px-2.5 py-2">
      <div className="flex items-center gap-0.5">
        <ToolButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </ToolButton>
        <ToolButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </ToolButton>
        <ToolButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline">U</span>
        </ToolButton>
        <ToolButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <span className="line-through">S</span>
        </ToolButton>
        <ToolButton label="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <span className="font-mono">{"</>"}</span>
        </ToolButton>
      </div>

      <div className="flex items-center gap-0.5">
        <ToolButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolButton>
        <ToolButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </ToolButton>
        <ToolButton label="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </ToolButton>
        <ToolButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </ToolButton>
        <ToolButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          “ ”
        </ToolButton>
        <ToolButton label="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <span className="font-mono">{"{ }"}</span>
        </ToolButton>
        <ToolButton label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          ―
        </ToolButton>
        <ToolButton label="Link" active={editor.isActive("link")} onClick={setLink}>
          Link
        </ToolButton>
      </div>

      <div className="flex items-center gap-0.5">
        <ToolButton label="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          ⇤
        </ToolButton>
        <ToolButton label="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          ↔
        </ToolButton>
        <ToolButton label="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          ⇥
        </ToolButton>
      </div>

      <select
        aria-label="Text size"
        value={SIZES.some((s) => s.value === currentSize) ? currentSize : ""}
        onChange={(e) => {
          const chain = editor.chain().focus();
          if (e.target.value) chain.setFontSize(e.target.value).run();
          else chain.unsetFontSize().run();
        }}
        className="h-8 rounded-[6px] border border-border bg-surface px-2 text-sm text-text-body"
      >
        {SIZES.map((s) => (
          <option key={s.label} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <Swatches
        label="Color"
        colors={COLORS}
        onPick={(v) => editor.chain().focus().setColor(v).run()}
        onClear={() => editor.chain().focus().unsetColor().run()}
      />
      <Swatches
        label="Highlight"
        colors={HIGHLIGHTS}
        onPick={(v) => editor.chain().focus().setBackgroundColor(v).run()}
        onClear={() => editor.chain().focus().unsetBackgroundColor().run()}
      />

      <div className="ml-auto flex items-center gap-0.5">
        <ToolButton
          label="Clear formatting"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          Clear
        </ToolButton>
        <ToolButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          ↶
        </ToolButton>
        <ToolButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          ↷
        </ToolButton>
      </div>
    </div>
  );
}

// `initialFormat` lets rows saved before the rich-text editor (Markdown) open
// as formatted text; saving converts them to HTML.
export function RichTextEditor({
  name,
  initialContent,
  initialFormat = "html",
  minHeight = 320,
}: {
  name: string;
  initialContent?: string;
  initialFormat?: "html" | "markdown";
  minHeight?: number;
}) {
  const [html, setHtml] = useState(() => {
    const raw = initialContent ?? "";
    return initialFormat === "markdown" ? (marked.parse(raw, { async: false }) as string) : raw;
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false, autolink: true } }),
      TextStyleKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: html,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: "rich-content px-4 py-3 focus:outline-none",
        style: `min-height:${minHeight}px`,
        "aria-label": "Rich text content",
      },
    },
    onUpdate: ({ editor: e }) => setHtml(e.isEmpty ? "" : e.getHTML()),
  });

  return (
    <div className="mt-1.5 overflow-hidden rounded-[8px] border border-border bg-bg focus-within:border-teal">
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
