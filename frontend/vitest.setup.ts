import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// RTL's auto-cleanup relies on a global `afterEach`, which only exists when
// Vitest's `test.globals` is enabled. We import describe/it/expect
// explicitly instead, so register cleanup manually.
afterEach(() => {
  cleanup();
});
