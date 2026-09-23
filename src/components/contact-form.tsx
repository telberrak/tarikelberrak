"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "@/actions/contact";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-[14px] border border-teal/30 bg-surface px-6 py-8 text-center"
      >
        <p className="font-display text-lg font-semibold text-text-primary">Message sent.</p>
        <p className="mt-2 text-sm text-text-dim">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      {/* Honeypot — real visitors never see this; bots that fill every field trip it. */}
      <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-body">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="mt-1.5 w-full rounded-[8px] border border-border bg-surface px-3.5 py-2.5 text-sm text-text-body placeholder:text-text-faint focus:border-teal"
            aria-invalid={Boolean(state.fieldErrors?.name)}
            aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
          />
          {state.fieldErrors?.name && (
            <p id="name-error" className="mt-1 text-xs text-red-400">
              {state.fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-body">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1.5 w-full rounded-[8px] border border-border bg-surface px-3.5 py-2.5 text-sm text-text-body placeholder:text-text-faint focus:border-teal"
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
          />
          {state.fieldErrors?.email && (
            <p id="email-error" className="mt-1 text-xs text-red-400">
              {state.fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text-body">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          className="mt-1.5 w-full resize-none rounded-[8px] border border-border bg-surface px-3.5 py-2.5 text-sm text-text-body placeholder:text-text-faint focus:border-teal"
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={state.fieldErrors?.message ? "message-error" : undefined}
        />
        {state.fieldErrors?.message && (
          <p id="message-error" className="mt-1 text-xs text-red-400">
            {state.fieldErrors.message}
          </p>
        )}
      </div>

      {state.status === "error" && !state.fieldErrors && (
        <p role="alert" className="text-sm text-red-400">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-[8px] bg-amber px-5 py-2.5 text-sm font-semibold text-amber-text hover:brightness-105 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
