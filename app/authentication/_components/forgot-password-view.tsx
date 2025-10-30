"use client";

import ResetPasswordForm from "@/components/reset-password-form";
import { AuthIllustration } from "./auth-illustration";
import { AuthShell } from "./auth-shell";
import { AuthView } from "./types";

interface ForgotPasswordViewProps {
  onNavigate: (view: AuthView) => void;
}

export function ForgotPasswordView({ onNavigate }: ForgotPasswordViewProps) {
  return (
    <AuthShell
      title="Reset Password"
      subtitle="Enter your email to receive reset instructions"
      illustration={<AuthIllustration />}
      footerSlot={
        <div className="text-center text-sm mt-6">
          <button
            type="button"
            className="text-teal-600 hover:underline"
            onClick={() => onNavigate("login")}
          >
            Back to Login
          </button>
        </div>
      }
    >
      <ResetPasswordForm onSuccess={() => onNavigate("login")} />
    </AuthShell>
  );
}
