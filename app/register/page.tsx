"use client"

import { useRouter } from "next/navigation"
import RegisterForm from "@/components/register-form"
import { Navbar } from "@/components/navbar"
import { TrendingHeader } from "@/components/trending-header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"



export default function RegisterPage() {
  const router = useRouter();
  return (
    <div>
      <Navbar />
      <TrendingHeader />
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 py-8 px-2">
        <div className="w-full max-w-3xl mx-auto rounded-3xl shadow-2xl bg-white dark:bg-neutral-900 flex flex-col md:flex-row overflow-hidden">
          {/* Illustration Side */}
          <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-teal-100 to-blue-200 dark:from-neutral-800 dark:to-neutral-900 p-10">
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
            <div className="mt-8 text-center">
              <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-300 mb-2">Welcome to Azure Horizon</h3>
              <p className="text-gray-600 dark:text-gray-300">Create your account and join our vibrant community!</p>
            </div>
          </div>
          {/* Form Side */}
          <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
            <div className="flex flex-col gap-2 mb-8 text-center">
              <span className="mx-auto mb-2 w-12 h-12 rounded-full bg-gradient-to-br from-teal-200 to-blue-200 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-teal-600">+</span>
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">Create your account</h2>
              <p className="text-gray-500 dark:text-gray-400">Sign up to get started with Azure Horizon</p>
            </div>
            <button type="button" className="w-full rounded-full flex items-center justify-center gap-2 bg-white border text-gray-700 hover:bg-gray-100 shadow-sm mb-6" disabled>
              <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block"><g><path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6-6C34.5 5.1 29.5 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.2-.3-3.5z"/><path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.8 13 24 13c2.7 0 5.2.9 7.2 2.4l6-6C34.5 5.1 29.5 3 24 3 15.3 3 7.9 8.7 6.3 14.7z"/><path fill="#FBBC05" d="M24 43c5.3 0 10.2-1.8 13.9-4.9l-6.4-5.2c-2 1.4-4.5 2.1-7.5 2.1-5.6 0-10.3-3.7-11.9-8.7l-6.6 5.1C7.8 39.3 15.3 43 24 43z"/><path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.1 3-4.1 5.5-7.3 6.2l6.4 5.2C39.7 37.2 44 31.7 44 24c0-1.3-.1-2.2-.3-3.5z"/></g></svg>
              Sign up with Google
            </button>
            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-gray-200 dark:bg-neutral-700" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-neutral-700" />
            </div>
            <RegisterForm onLogin={() => router.push('/login')} />
          </div>
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
