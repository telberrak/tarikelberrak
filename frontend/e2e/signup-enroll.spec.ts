import { test, expect } from "@playwright/test";

/**
 * The core paid-content flow, end to end: an account has to exist, enroll in
 * a course, and be able to make (and see) progress through it. This is the
 * same flow verified manually against `docker compose up` during
 * development — codified here so it can't silently regress.
 *
 * Assumes the seeded free course `bases-bourse-debutants` exists (see
 * backend/src/main/resources/db/migration/V2__seed_courses.sql) and the
 * stack is already running (docker compose up, or `npm run dev` + backend).
 */
test("signup, enroll in a free course, and mark a lesson complete", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;

  await page.goto("/signup");
  await page.getByLabel("Name").fill("E2E Test User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign up" }).click();

  await expect(page).toHaveURL(/\/account/);
  await expect(page.getByRole("heading", { name: "My Courses" })).toBeVisible();

  await page.goto("/learn/bases-bourse-debutants");
  await page.getByRole("button", { name: "Enroll for free" }).click();

  // Enrolling redirects into the player, onto the first lesson.
  await expect(page).toHaveURL(/\/learn\/bases-bourse-debutants\/learn\//);
  await expect(page.getByText(/0\/6.*0%/)).toBeVisible();

  await page.getByRole("button", { name: "Mark as complete" }).click();

  await expect(page.getByText(/1\/6.*17%/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Completed" })).toBeVisible();
});
