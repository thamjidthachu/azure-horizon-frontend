"use client";
import { useRouter } from "next/navigation";
import { ForgotPasswordView } from "@/app/authentication/_components/forgot-password-view";
import { AuthView } from "@/app/authentication/_components/types";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleNavigate = (next: AuthView) => {
    if (next === "forgot-password") return;
    if (next === "login") {
      router.push("/login");
    } else if (next === "register") {
      router.push("/register");
    } else if (next === "reset-password") {
      router.push("/reset-password");
    }
  };

  return <ForgotPasswordView onNavigate={handleNavigate} />;
}
