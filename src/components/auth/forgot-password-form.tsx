"use client";

import { useState } from "react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setPending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="rounded-[14px] border border-teal/30 bg-surface px-5 py-6 text-sm text-text-dim">
        If an account exists for <span className="text-text-primary">{email}</span>, a reset link
        is on its way.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-body">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-[8px] border border-border bg-surface px-3.5 py-2.5 text-sm text-text-body focus:border-teal"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-full rounded-[8px] bg-amber px-5 py-2.5 text-sm font-semibold text-amber-text hover:brightness-105 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
