import * as React from "react";
import Image from "next/image";

// Dirham icon using the UAE dirham SVG file
export function DirhamIcon({ className = "h-5 w-5 inline-block align-text-bottom", ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <Image
      src="/uae-dirham.svg"
      alt="AED"
      width={20}
      height={20}
      className={className}
      {...(props as any)}
    />
  );
}