import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

interface LoginFormProps {
  onForgotPassword: () => void
  onRegister: () => void
}

export default function LoginForm({ onForgotPassword, onRegister }: LoginFormProps) {
  const [form, setForm] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { checkAuth } = useAuth()
  const redirectUrl = searchParams.get('redirect') || '/'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include"
    })
    if (res.ok) {
      const data = await res.json()
      localStorage.setItem("access_token", data.access)
      localStorage.setItem("refresh_token", data.refresh)
      await checkAuth()

      // Show success message from API response
      toast({
        title: "Success",
        description: data.message || "Login successful! Welcome back!",
        variant: "success",
        duration: 3000
      })
      router.push(redirectUrl)
    } else {
      const err = await res.json()

      // Show error message from API response
      toast({
        title: "Login failed",
        description: err.error || err.message || err.detail || "Invalid credentials.",
        variant: "destructive",
        duration: 3000
      })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-0.5">
        <Label htmlFor="username" className="text-sm font-medium">Email</Label>
        <Input id="username" name="username" type="email" value={form.username} onChange={handleChange} required autoFocus />
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
        <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="accent-teal-500" />
          Remember Me
        </label>
        <button type="button" className="hover:underline text-teal-600" onClick={onForgotPassword}>
          Forgot password?
        </button>
      </div>
      <Button type="submit" className="w-full rounded py-2 text-base font-semibold mt-2" disabled={loading}>
        {loading ? "Logging in..." : "Log In"}
      </Button>
      <div className="flex items-center gap-2 my-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <Button type="button" className="w-full rounded-full flex items-center justify-center gap-2 bg-white border text-gray-700 hover:bg-gray-100 shadow-sm" disabled>
        <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block"><g><path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6-6C34.5 5.1 29.5 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.2-.3-3.5z" /><path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.8 13 24 13c2.7 0 5.2.9 7.2 2.4l6-6C34.5 5.1 29.5 3 24 3 15.3 3 7.9 8.7 6.3 14.7z" /><path fill="#FBBC05" d="M24 43c5.3 0 10.2-1.8 13.9-4.9l-6.4-5.2c-2 1.4-4.5 2.1-7.5 2.1-5.6 0-10.3-3.7-11.9-8.7l-6.6 5.1C7.8 39.3 15.3 43 24 43z" /><path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.1 3-4.1 5.5-7.3 6.2l6.4 5.2C39.7 37.2 44 31.7 44 24c0-1.3-.1-2.2-.3-3.5z" /></g></svg>
        Log in with Google
      </Button>
      <div className="text-center text-sm mt-6">
        Don't have an account? <button type="button" className="text-teal-600 hover:underline" onClick={onRegister}>Register</button>
      </div>
    </form>
  )
}
