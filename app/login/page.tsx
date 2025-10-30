"use client"

import { useRouter } from "next/navigation"
import { LoginView } from "@/app/authentication/_components/login-view"
import { AuthView } from "@/app/authentication/_components/types"

// Force dynamic rendering to prevent prerendering issues with useSearchParams
export const dynamic = 'force-dynamic'

export default function LoginPage() {
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
