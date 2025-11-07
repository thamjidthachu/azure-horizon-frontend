"use client"

import { useRouter } from "next/navigation"
import { Suspense } from "react"
import { LoginView } from "@/app/authentication/_components/login-view"
import { AuthView } from "@/app/authentication/_components/types"

function LoginContent() {
  const router = useRouter()

  const handleNavigate = (next: AuthView) => {
    if (next === "login") return
    if (next === "register") {
      router.push("/register")
    } else if (next === "forgot-password") {
      router.push("/forgot-password")
    } else if (next === "reset-password") {
      router.push("/reset-password")
    }
  }

  return <LoginView onNavigate={handleNavigate} />
}

function LoginLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
}
