"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface ResetPasswordFormProps {
  onSuccess?: () => void
}

export default function ResetPasswordForm({ onSuccess }: ResetPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email })
      })
      if (res.ok) {
        const data = await res.json()
        toast({
          title: "Success",
          description: data.message || "Password reset instructions sent to your email.",
          variant: "success",
          duration: 4000
        })
        setEmail("")
        if (onSuccess) onSuccess()
      } else {
        const err = await res.json()
        toast({
          title: "Error",
          description: err.message || "Failed to send reset instructions.",
          variant: "destructive",
          duration: 4000
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
        duration: 4000
      })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-0.5">
        <Label htmlFor="reset-email" className="text-sm font-medium">Email</Label>
        <Input id="reset-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
      </div>
      <Button type="submit" className="w-full rounded py-2 text-base font-semibold mt-2" disabled={loading}>
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  )
}
