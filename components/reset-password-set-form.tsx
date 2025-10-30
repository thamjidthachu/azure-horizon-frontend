"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

interface ResetPasswordSetFormProps {
  username: string;
  token: string;
  onSuccess?: () => void;
}

export default function ResetPasswordSetForm({ username, token, onSuccess }: ResetPasswordSetFormProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, new_password: password, token })
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Success",
          description: data.message || "Password has been reset successfully.",
          variant: "success",
          duration: 4000
        });
        setPassword("");
        setConfirm("");
        if (onSuccess) onSuccess();
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const canSubmit = password.length > 0 && confirm.length > 0 && password === confirm;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 space-y-0.5">
          <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="pr-10"
              autoFocus
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="flex-1 space-y-0.5">
          <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              onClick={() => setShowConfirm(v => !v)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      <Button
        type="submit"
        className="w-full rounded py-2 text-base font-semibold mt-2"
        disabled={loading || !canSubmit}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}
