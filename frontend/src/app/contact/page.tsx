import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about architecture consulting, AI labs, or financial education.",
};

export default function ContactPage() {
  return (
    <>
      <Hero
        eyebrow="Get in touch"
        title="Let's talk."
        description="Consulting, speaking, collaboration on a lab, or a question about a course — send a message and I'll reply personally."
      />
      <div className="container-page pb-24">
        <div className="max-w-xl">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
