"use client"

import { useRouter } from "next/navigation"
import { RegisterView } from "@/app/authentication/_components/register-view"
import { AuthView } from "@/app/authentication/_components/types"

export default function RegisterPage() {
  const router = useRouter()

  const handleNavigate = (next: AuthView) => {
    if (next === "register") return
    if (next === "login") {
      router.push("/login")
    } else if (next === "forgot-password") {
      router.push("/forgot-password")
    } else if (next === "reset-password") {
      router.push("/reset-password")
    }
  }

  return <RegisterView onNavigate={handleNavigate} />
}
