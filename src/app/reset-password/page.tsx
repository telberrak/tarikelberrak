import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Set new password" };

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Set a new password" description="Choose a new password for your account.">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
