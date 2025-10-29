"use client";
import { Navbar } from "@/components/navbar";
import { TrendingHeader } from "@/components/trending-header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import ResetPasswordSetForm from "@/components/reset-password-set-form";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const username = searchParams.get("username");

  if (!token || !username) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid password reset link</h2>
          <a href="/forgot-password" className="text-teal-600 hover:underline">Request a new reset link</a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <TrendingHeader />
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden">
          {/* Illustration Side */}
          <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gray-50 dark:bg-neutral-800 p-8">
            <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="160" r="50" fill="#FFB366"/>
              <rect x="120" y="100" width="60" height="90" rx="15" fill="#A78BFA"/>
              <rect x="70" y="60" width="40" height="130" rx="15" fill="#22223B"/>
              <rect x="170" y="130" width="30" height="60" rx="10" fill="#FDE047"/>
              <circle cx="60" cy="160" r="6" fill="#22223B"/>
              <circle cx="80" cy="160" r="6" fill="#22223B"/>
              <rect x="75" y="175" width="20" height="5" rx="2.5" fill="#22223B"/>
              <circle cx="135" cy="120" r="5" fill="#22223B"/>
              <circle cx="155" cy="120" r="5" fill="#22223B"/>
              <rect x="140" y="135" width="20" height="4" rx="2" fill="#22223B"/>
              <circle cx="185" cy="150" r="3" fill="#22223B"/>
            </svg>
          </div>
          {/* Form Side */}
          <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
            <div className="flex flex-col gap-2 mb-8 text-center">
              <span className="mx-auto mb-2 w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
                <span className="text-2xl font-bold text-teal-600">+</span>
              </span>
              <h2 className="text-3xl font-bold">Reset Password</h2>
              <p className="text-gray-500">Enter your new password below.</p>
            </div>
            <ResetPasswordSetForm
              username={username as string}
              token={token as string}
              onSuccess={() => router.push('/login')}
            />
          </div>
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
