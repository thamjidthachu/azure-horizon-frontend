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
    password: "",
    password2: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
    // Removed fileInputRef and avatar logic

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v) data.append(k, v);
    });
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register/`, {
      method: "POST",
      body: data,
    });
    if (res.status === 200 || res.status === 201) {
      toast({
        title: "Registration successful!",
        description: "You have successfully registered. Redirecting to login...",
        variant: "success",
        duration: 3000,
      });
      setTimeout(() => {
        onLogin();
      }, 1500);
      setForm({
        username: "",
        full_name: "",
        email: "",
        phone: "",
        password: "",
        password2: "",
      });
    } else {
      let errMsg = "Registration failed. Please check your input.";
      try {
        const err = await res.json();
        errMsg = err.detail || errMsg;
      } catch {}
      toast({
        title: "Registration failed",
        description: errMsg,
        variant: "destructive",
        duration: 3000,
      });
    }
    setLoading(false);
  };

  return (
  <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 space-y-0.5">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" value={form.username} onChange={handleChange} required autoFocus />
          </div>
    <div className="flex-1 space-y-0.5">
            <Label htmlFor="full_name">Name</Label>
            <Input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} required />
          </div>
        </div>
  <div className="space-y-0.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
      </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 space-y-0.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
    <div className="flex-1 space-y-0.5">
            <Label htmlFor="password2">Confirm Password</Label>
            <Input id="password2" name="password2" type="password" value={form.password2} onChange={handleChange} required minLength={6} />
          </div>
        </div>
      <Button
        type="submit"
        className="w-full mt-2 rounded py-2 text-base font-semibold"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </Button>
      <div className="text-center text-sm mt-6">
        Already have an account? <button type="button" className="text-teal-600 hover:underline" onClick={onLogin}>Login</button>
      </div>
    </form>
  );
}

