"use client";

import { PropsWithChildren } from "react";

export function AuthIllustration({ children }: PropsWithChildren) {
  return (
    <>
      <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="160" r="50" fill="#FFB366" />
        <rect x="120" y="100" width="60" height="90" rx="15" fill="#A78BFA" />
        <rect x="70" y="60" width="40" height="130" rx="15" fill="#22223B" />
        <rect x="170" y="130" width="30" height="60" rx="10" fill="#FDE047" />
        <circle cx="60" cy="160" r="6" fill="#22223B" />
        <circle cx="80" cy="160" r="6" fill="#22223B" />
        <rect x="75" y="175" width="20" height="5" rx="2.5" fill="#22223B" />
        <circle cx="135" cy="120" r="5" fill="#22223B" />
        <circle cx="155" cy="120" r="5" fill="#22223B" />
        <rect x="140" y="135" width="20" height="4" rx="2" fill="#22223B" />
        <circle cx="185" cy="150" r="3" fill="#22223B" />
      </svg>
      {children}
    </>
  );
}
