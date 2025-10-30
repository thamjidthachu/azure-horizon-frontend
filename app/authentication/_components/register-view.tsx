"use client";

import RegisterForm from "@/components/register-form";
import { AuthIllustration } from "./auth-illustration";
import { AuthShell } from "./auth-shell";
import { AuthView } from "./types";

interface RegisterViewProps {
  onNavigate: (view: AuthView) => void;
}

export function RegisterView({ onNavigate }: RegisterViewProps) {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Sign up to get started with Azure Horizon"
      illustration={
        <AuthIllustration>
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-300 mb-2">
              Welcome to Azure Horizon
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create your account and join our vibrant community!
            </p>
          </div>
        </AuthIllustration>
      }
      outerClassName="bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900"
      illustrationWrapperClassName="bg-gradient-to-br from-teal-100 to-blue-200 dark:from-neutral-800 dark:to-neutral-900"
    >
      <RegisterForm onLogin={() => onNavigate("login")} />
    </AuthShell>
  );
}
