"use server";

import { headers } from "next/headers";
import { ApiError, apiFetch } from "@/lib/api/client";
import { extractClientIp } from "@/lib/client-ip";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot: a real visitor never sees or fills this field (hidden via CSS
  // in ContactForm); bots that blindly fill every input trip it.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { status: "success", message: "Thanks — I'll get back to you shortly." };
  }

  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  try {
    const clientIp = extractClientIp(await headers());
    await apiFetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
      headers: { "X-Client-IP": clientIp },
    });
    return { status: "success", message: "Thanks — I'll get back to you shortly." };
  } catch (e) {
    if (e instanceof ApiError) {
      return {
        status: "error",
        message: e.fieldErrors ? "Please fix the fields below." : e.message,
        fieldErrors: e.fieldErrors as ContactFormState["fieldErrors"],
      };
    }
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}
