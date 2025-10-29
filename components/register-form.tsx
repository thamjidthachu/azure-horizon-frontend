import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface RegisterFormProps {
  onLogin: () => void
}

export default function RegisterForm({ onLogin }: RegisterFormProps) {
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
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        onLogin()
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" value={form.username} onChange={handleChange} required autoFocus />
      </div>
      <div className="space-y-1">
        <Label htmlFor="full_name">Full Name</Label>
        <Input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
      </div>
      <div className="space-y-1">
        <Label>Gender</Label>
        <div className="flex gap-2 mt-1">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full border transition-colors text-base font-medium
              ${form.gender === "M" ? "bg-teal-600 text-white border-teal-600 shadow" : "bg-gray-100 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-200 hover:bg-teal-50"}`}
            onClick={() => setForm(f => ({ ...f, gender: "M" }))}
            aria-pressed={form.gender === "M"}
          > Male
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full border transition-colors text-base font-medium
              ${form.gender === "F" ? "bg-teal-600 text-white border-teal-600 shadow" : "bg-gray-100 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-200 hover:bg-teal-50"}`}
            onClick={() => setForm(f => ({ ...f, gender: "F" }))}
            aria-pressed={form.gender === "F"}
          > Female
          </button>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="avatar">Avatar</Label>
        <Input id="avatar" name="avatar" type="file" accept="image/*" ref={fileInputRef} onChange={handleChange} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password2">Confirm Password</Label>
        <Input id="password2" name="password2" type="password" value={form.password2} onChange={handleChange} required minLength={6} />
      </div>
      <Button
        type="submit"
        className="w-full mt-2 rounded-full py-2 text-base font-semibold"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </Button>
      <div className="text-center text-sm mt-6">
        Already have an account? <button type="button" className="text-teal-600 hover:underline" onClick={onLogin}>Login</button>
      </div>
    </form>
  )
}

