"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { ResetPasswordView } from "@/app/authentication/_components/reset-password-view";
import { AuthView } from "@/app/authentication/_components/types";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const username = searchParams.get("username");

  if (!token || !username) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid password reset link</h2>
          <a href="/forgot-password" className="text-teal-600 hover:underline">Request a new reset link</a>
        </div>
      </div>
    );
  }

  const handleNavigate = (next: AuthView) => {
    if (next === "login") {
      router.push("/login");
    } else if (next === "register") {
      router.push("/register");
    } else if (next === "forgot-password") {
      router.push("/forgot-password");
    } else if (next === "reset-password") {
      router.replace("/reset-password");
    }
  };

  return <ResetPasswordView username={username} token={token} onNavigate={handleNavigate} />;
}
