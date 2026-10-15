import sanitizeHtml from "sanitize-html";

const COLOR = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%/]+\)|hsla?\([\d\s.,%/]+\)|[a-z]+)$/i;
const FONT_SIZE = /^\d+(\.\d+)?(px|rem|em|%)$/;
const ALIGN = /^(left|right|center|justify)$/;

const STYLE_ATTR = ["style"];

// Content is admin-authored, but it is rendered with dangerouslySetInnerHTML, so
// it is always sanitized on render: only formatting tags, only safe style props.
export function sanitizeRichHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "h1", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "sub", "sup",
      "span", "mark", "a", "ul", "ol", "li", "blockquote", "pre", "code", "hr",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      p: STYLE_ATTR,
      h1: STYLE_ATTR,
      h2: STYLE_ATTR,
      h3: STYLE_ATTR,
      h4: STYLE_ATTR,
      span: STYLE_ATTR,
      mark: STYLE_ATTR,
    },
    allowedStyles: {
      "*": {
        color: [COLOR],
        "background-color": [COLOR],
        "font-size": [FONT_SIZE],
        "text-align": [ALIGN],
      },
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer nofollow" }),
    },
  });
}
