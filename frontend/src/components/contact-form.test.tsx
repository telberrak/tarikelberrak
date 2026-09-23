import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// ContactForm pulls in the real submitContactForm server action, which
// imports "server-only" — correctly fatal outside a real Next.js server
// boundary. This component test only cares about the form's structure
// (required fields, honeypot), not the submission flow, so stub the action.
vi.mock("@/actions/contact", () => ({
  submitContactForm: vi.fn(async () => ({ status: "idle" as const })),
}));

const { ContactForm } = await import("@/components/contact-form");

describe("ContactForm", () => {
  it("requires name, email and message before it can be submitted", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/name/i)).toBeRequired();
    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/message/i)).toBeRequired();
  });

  it("uses a real email input so the browser validates the format", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
  });

  it("includes a honeypot field that real visitors never see", () => {
    render(<ContactForm />);

    const honeypot = screen.getByLabelText("Company", { selector: "input" });
    expect(honeypot).toHaveAttribute("tabIndex", "-1");
    expect(honeypot).toHaveAttribute("autoComplete", "off");
    // The wrapping element is visually hidden off-screen, not display:none —
    // that's deliberate (see contact-form.tsx), so assert the mechanism
    // rather than a specific CSS property.
    expect(honeypot.closest("div")).toHaveAttribute("aria-hidden", "true");
  });
});
