import * as React from "react";

// Dirham symbol as per user-provided image
export function DirhamIcon({ className = "h-5 w-5 inline-block align-text-bottom", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 210"
      fill="currentColor"
      className={className}
      {...props}
    >
      <g>
        <path d="M40 10 Q40 200 120 200 Q200 200 200 110 Q200 20 120 20 Q80 20 80 110 Q80 200 120 200" fill="none" stroke="currentColor" strokeWidth="20"/>
        <path d="M40 60 H200" stroke="currentColor" strokeWidth="20"/>
        <path d="M40 110 H200" stroke="currentColor" strokeWidth="20"/>
      </g>
    </svg>
  );
}