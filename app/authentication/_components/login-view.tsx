"use client";

import LoginForm from "@/components/login-form";
import { AuthIllustration } from "./auth-illustration";
import { AuthShell } from "./auth-shell";
import { AuthView } from "./types";

interface LoginViewProps {
  onNavigate: (view: AuthView) => void;
}

export function LoginView({ onNavigate }: LoginViewProps) {
  return (
    <AuthShell
      title="Welcome back!"
      subtitle="Please enter your details"
      illustration={<AuthIllustration />}
    >
      <LoginForm onForgotPassword={() => onNavigate("forgot-password")} onRegister={() => onNavigate("register")} />
    </AuthShell>
  );
}
