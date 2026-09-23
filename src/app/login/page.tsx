import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in"
      description="Welcome back."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-teal hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
