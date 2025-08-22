"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { User, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { TrendingHeader } from "@/components/trending-header"
import { Footer } from "@/components/footer"

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include"
    })
    if (res.ok) {
      const data = await res.json()
      // Save tokens
      localStorage.setItem("access_token", data.access)
      localStorage.setItem("refresh_token", data.refresh)
      toast({ title: "Login successful!", description: "Welcome back!" })
      // Redirect to profile or home
      router.push("/")
    } else {
      const err = await res.json()
      toast({ title: "Login failed", description: err.detail || "Invalid credentials.", variant: "destructive" })
    }
    setLoading(false)
  }

  return (
    <div>
      <Navbar />
      <TrendingHeader />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-white">
        <Card className="w-full max-w-md shadow-xl animate-fade-in">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>
            <p className="text-gray-500 mb-6 text-center">Sign in to your account</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-teal-500"/>
                <Input id="username" name="username" value={form.username} onChange={handleChange} required autoFocus />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-teal-500"/>
                <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
              </div>
            </div>
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <Separator className="my-6"/>
          <div className="text-center text-sm">
            Don't have an account? <a href="/register" className="text-teal-600 hover:underline">Register</a>
          </div>
        </CardContent>
      </Card>
    </div>
    < Footer />
    </div>
  )
}