"use client";

import ResetPasswordSetForm from "@/components/reset-password-set-form";
import { AuthIllustration } from "./auth-illustration";
import { AuthShell } from "./auth-shell";
import { AuthView } from "./types";

interface ResetPasswordViewProps {
  username: string;
  token: string;
  onNavigate: (view: AuthView) => void;
}

export function ResetPasswordView({ username, token, onNavigate }: ResetPasswordViewProps) {
  return (
    <AuthShell
      title="Reset Password"
      subtitle="Enter your new password below."
      illustration={<AuthIllustration />}
    >
      <ResetPasswordSetForm username={username} token={token} onSuccess={() => onNavigate("login")} />
    </AuthShell>
  );
}
