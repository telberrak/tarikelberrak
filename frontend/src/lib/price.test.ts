import { describe, expect, it } from "vitest";
import { centsToDollarsInput, dollarsToCents } from "@/lib/price";

describe("dollarsToCents", () => {
  it("converts dollars to whole cents without float drift", () => {
    expect(dollarsToCents("9.99")).toBe(999);
    expect(dollarsToCents("19.90")).toBe(1990);
    expect(dollarsToCents("0.5")).toBe(50);
  });

  it("treats empty, invalid or non-positive input as zero", () => {
    expect(dollarsToCents(null)).toBe(0);
    expect(dollarsToCents("")).toBe(0);
    expect(dollarsToCents("abc")).toBe(0);
    expect(dollarsToCents("-3")).toBe(0);
  });
});

describe("centsToDollarsInput", () => {
  it("formats cents for a dollars input, blank when free", () => {
    expect(centsToDollarsInput(4900)).toBe("49.00");
    expect(centsToDollarsInput(999)).toBe("9.99");
    expect(centsToDollarsInput(0)).toBe("");
    expect(centsToDollarsInput(undefined)).toBe("");
  });
});
