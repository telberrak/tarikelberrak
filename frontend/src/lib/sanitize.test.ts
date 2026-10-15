import { describe, expect, it } from "vitest";
import { sanitizeRichHtml } from "@/lib/sanitize";

describe("sanitizeRichHtml", () => {
  it("keeps formatting, colour and highlight styles", () => {
    const html =
      '<p style="text-align: center"><strong>Hi</strong> <span style="color: #e5484d">red</span> <span style="background-color: #fde68a">hl</span></p>';
    const out = sanitizeRichHtml(html);
    expect(out).toContain("<strong>Hi</strong>");
    expect(out).toContain("color:#e5484d");
    expect(out).toContain("background-color:#fde68a");
    expect(out).toContain("text-align:center");
  });

  it("strips scripts, event handlers and iframes", () => {
    const out = sanitizeRichHtml(
      '<p onclick="x()">a</p><script>alert(1)</script><iframe src="https://evil"></iframe><img src=x onerror=alert(1)>',
    );
    expect(out).not.toMatch(/script|onclick|iframe|onerror|<img/i);
    expect(out).toContain("<p>a</p>");
  });

  it("blocks javascript: links and forces safe rel on links", () => {
    expect(sanitizeRichHtml('<a href="javascript:alert(1)">x</a>')).not.toContain("javascript:");
    expect(sanitizeRichHtml('<a href="https://example.com">x</a>')).toContain('rel="noopener noreferrer nofollow"');
  });

  it("drops disallowed style properties", () => {
    const out = sanitizeRichHtml('<span style="position:fixed;color:red;background:url(x)">x</span>');
    expect(out).not.toMatch(/position|url\(/);
    expect(out).toContain("color:red");
  });
});
