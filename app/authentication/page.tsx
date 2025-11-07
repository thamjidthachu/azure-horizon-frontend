"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ForgotPasswordView } from "./_components/forgot-password-view";
import { LoginView } from "./_components/login-view";
import { RegisterView } from "./_components/register-view";
import { ResetPasswordView } from "./_components/reset-password-view";
import { AuthView, isAuthView } from "./_components/types";

function AuthenticationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [view, setView] = useState<AuthView>(() => {
    const initial = searchParams.get("view");
    return isAuthView(initial) ? initial : "login";
  });

  useEffect(() => {
    const paramView = searchParams.get("view");
    if (isAuthView(paramView) && paramView !== view) {
      setView(paramView);
    }
  }, [searchParams, view]);

  const navigate = useCallback(
    (nextView: AuthView) => {
      setView(nextView);
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", nextView);

      if (nextView !== "reset-password") {
        params.delete("token");
        params.delete("username");
      }

      const query = params.toString();
      router.replace(`?${query}`, { scroll: false });
    },
    [router, searchParams]
  );

  const token = searchParams.get("token");
  const username = searchParams.get("username");

  if (view === "reset-password") {
    if (!token || !username) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
          <div className="max-w-md rounded-2xl bg-white dark:bg-neutral-900 p-10 text-center shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Invalid password reset link</h2>
            <p className="text-gray-500 dark:text-gray-400">
              The password reset link is invalid or has expired.
            </p>
            <button
              className="mt-6 text-teal-600 hover:underline font-medium"
              onClick={() => navigate("forgot-password")}
            >
              Request a new reset link
            </button>
          </div>
        </div>
      );
    }

    return <ResetPasswordView username={username} token={token} onNavigate={navigate} />;
  }

  if (view === "register") {
    return <RegisterView onNavigate={navigate} />;
  }

  if (view === "forgot-password") {
    return <ForgotPasswordView onNavigate={navigate} />;
  }

  return <LoginView onNavigate={navigate} />;
}

// Loading component for Suspense fallback
function AuthenticationLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
    </div>
  );
}

export default function AuthenticationPage() {
  return (
    <Suspense fallback={<AuthenticationLoading />}>
      <AuthenticationContent />
    </Suspense>
  );
}
