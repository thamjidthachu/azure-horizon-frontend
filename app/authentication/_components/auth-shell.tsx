"use client";

import { PropsWithChildren, ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { TrendingHeader } from "@/components/trending-header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

interface AuthShellProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  illustration?: ReactNode;
  footerSlot?: ReactNode;
  outerClassName?: string;
  illustrationWrapperClassName?: string;
  formColumnClassName?: string;
}

export function AuthShell({
  title,
  subtitle,
  illustration,
  footerSlot,
  outerClassName,
  illustrationWrapperClassName,
  formColumnClassName,
  children
}: AuthShellProps) {
  return (
    <div>
      <Navbar />
      <TrendingHeader />
      <div className={`min-h-[80vh] flex items-center justify-center py-8 px-4 ${outerClassName ?? "bg-gray-100 dark:bg-gray-900"}`}>
        <div className="flex w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className={`hidden md:flex flex-col items-center justify-center w-1/2 px-8 ${illustrationWrapperClassName ?? "bg-gray-50 dark:bg-neutral-800"}`}>
            {illustration}
          </div>
          <div
            className={`w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 ${
              formColumnClassName ?? ""
            }`}
          >
            <div className="flex flex-col gap-2 mb-8 text-center">
              <span className="mx-auto mb-2 w-12 h-12 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
                <span className="text-3xl font-bold text-teal-600">+</span>
              </span>
              <h2 className="text-3xl font-bold">{title}</h2>
              <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
            {children}
            {footerSlot}
          </div>
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
