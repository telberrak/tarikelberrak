"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setPending(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: name || email.split("@")[0], email, password }),
    });
    setPending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-body">
          Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 w-full rounded-[8px] border border-border bg-surface px-3.5 py-2.5 text-sm text-text-body focus:border-teal"
        />
      </div>

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

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-body">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        {pending ? "Creating account…" : "Sign up"}
      </button>
    </form>
  );
}
