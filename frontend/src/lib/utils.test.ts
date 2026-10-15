import { describe, expect, it } from "vitest";
import { cn, formatDuration, formatPrice } from "@/lib/utils";

describe("cn", () => {
  it("joins truthy class names with a space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});

describe("formatPrice", () => {
  it("shows 'Free' for zero cents", () => {
    expect(formatPrice(0)).toBe("Free");
  });

  it("formats whole-dollar amounts without decimals", () => {
    expect(formatPrice(4900)).toBe("$49");
  });

  it("formats amounts with cents", () => {
    expect(formatPrice(4950)).toBe("$49.50");
  });
});

describe("formatDuration", () => {
  it("formats seconds as m:ss", () => {
    expect(formatDuration(65)).toBe("1:05");
  });

  it("pads single-digit seconds", () => {
    expect(formatDuration(9)).toBe("0:09");
  });

  it("handles durations over an hour as raw minutes", () => {
    expect(formatDuration(3661)).toBe("61:01");
  });
});
