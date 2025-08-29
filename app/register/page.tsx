"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { User, Mail, Phone, Lock, Image as ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"
import { TrendingHeader } from "@/components/trending-header"
import { Navbar } from "@/components/navbar"

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    password2: "",
    avatar: null as File | null,
  })
  const [loading, setLoading] = useState(false)
  const [usernameError, setUsernameError] = useState("")
  const [emailError, setEmailError] = useState("")
  // Remove valid state, use only error state for UI logic
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  // Username/email uniqueness check (GET with query params)
  const checkFieldUnique = async (field: "username" | "email", value: string) => {
    if (!value) {
      if (field === "username") setUsernameError("");
      if (field === "email") setEmailError("");
      return;
    }
    try {
      const params = new URLSearchParams({ [field]: value });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/user-check/?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (typeof data.status === "boolean") {
          if (data.status) {
            if (field === "username") setUsernameError("Username already exists");
            if (field === "email") setEmailError("Email already exists");
          } else {
            if (field === "username") setUsernameError("");
            if (field === "email") setEmailError("");
          }
        } else {
          if (field === "username") setUsernameError("");
          if (field === "email") setEmailError("");
        }
      } else {
        if (field === "username") setUsernameError("");
        if (field === "email") setEmailError("");
      }
    } catch (e) {
      if (field === "username") setUsernameError("");
      if (field === "email") setEmailError("");
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target
    if (type === "file" && files) {
      setForm(f => ({ ...f, avatar: files[0] }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.password2) {
      toast({ 
        title: "Passwords do not match", 
        variant: "destructive",
        duration: 3000
      })
      return
    }
    setLoading(true)
    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (k === "avatar" && v) {
        data.append("avatar", v as File)
      } else if (v && k !== "avatar") {
        data.append(k, v)
      }
    })
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register/`, {
      method: "POST",
      body: data,
    })
    if (res.status === 200 || res.status === 201) {
      toast({
        title: "Registration successful!",
        description: "You have successfully registered. Redirecting to login...",
        variant: "success",
        duration: 3000
      })
      setTimeout(() => {
        router.push("/login")
      }, 1500)
      setForm({
        username: "",
        full_name: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        password2: "",
        avatar: null,
      })
      if (fileInputRef.current) fileInputRef.current.value = ""
    } else {
      let errMsg = "Registration failed. Please check your input."
      try {
        const err = await res.json()
        errMsg = err.detail || errMsg
      } catch {}
      toast({ 
        title: "Registration failed", 
        description: errMsg, 
        variant: "destructive",
        duration: 3000
      })
    }
    setLoading(false)
  }

  return (
    <div>
      <Navbar />
      <TrendingHeader />
    <div className="flex justify-center py-12">
      <Card className="w-full max-w-md shadow-xl animate-fade-in">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-2 text-center">Create Account</h2>
          <p className="text-gray-500 mb-6 text-center">Join our Azure community</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  onBlur={e => checkFieldUnique("username", e.target.value)}
                  required
                  autoFocus
                    className={usernameError ? "border-red-500 focus-visible:ring-red-500" : undefined}
                />
                <User className="h-5 w-5 text-teal-500"/>
              </div>
              {usernameError && (
                <div className="text-red-500 text-xs mt-1">{usernameError}</div>
              )}
            </div>
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <div className="flex items-center gap-2">
                <Input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} required />
                <User className="h-5 w-5 text-teal-500"/>
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={e => checkFieldUnique("email", e.target.value)}
                  required
                    className={emailError ? "border-red-500 focus-visible:ring-red-500" : undefined}
                />
                <Mail className="h-5 w-5 text-teal-500"/>
              </div>
              {emailError && (
                <div className="text-red-500 text-xs mt-1">{emailError}</div>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <div className="flex items-center gap-2">
                <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
                <Phone className="h-5 w-5 text-teal-500"/>
              </div>
            </div>
            <div>
              <Label>Gender</Label>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="M"
                    checked={form.gender === "M"}
                    onChange={handleChange}
                    className="accent-teal-500"
                  />
                   Male <span role="img" aria-label="Male" className="text-blue-500">♂️</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="M"
                    checked={form.gender === "F"}
                    onChange={handleChange}
                    className="accent-teal-500"
                  />
                  Female <span role="img" aria-label="Female" className="text-pink-500">♀️</span>
                </label>
              </div>
            </div>
            <div>
              <Label htmlFor="avatar">Avatar</Label>
              <div className="flex items-center gap-2">
                <Input id="avatar" name="avatar" type="file" accept="image/*" ref={fileInputRef} onChange={handleChange} />
                <ImageIcon className="h-5 w-5 text-teal-500"/>
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="flex items-center gap-2">
                <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
                <Lock className="h-5 w-5 text-teal-500"/>
              </div>
            </div>
            <div>
              <Label htmlFor="password2">Confirm Password</Label>
              <div className="flex items-center gap-2">
                <Input id="password2" name="password2" type="password" value={form.password2} onChange={handleChange} required minLength={6} />
                <Lock className="h-5 w-5 text-teal-500"/>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-2"
              disabled={
                loading ||
                !form.username ||
                !form.email ||
                !!usernameError ||
                !!emailError
              }
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
          <Separator className="my-6"/>
          <div className="text-center text-sm">
            Already have an account? <a href="/login" className="text-teal-600 hover:underline">Login</a>
          </div>
        </CardContent>
      </Card>
    </div>
    <Footer />
    <Toaster />
    </div>
  )
}