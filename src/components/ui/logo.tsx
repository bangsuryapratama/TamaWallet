import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

/**
 * Logo resmi TamaWallet — Ringan, presisi, dan bernuansa finansial modern.
 * Bentuk geometrik: Dua lipatan kartu presisi membentuk huruf 'T' dan siluet brankas/wallet.
 */
export function LogoIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      {/* Outer wallet silhouette with crisp geometric radius */}
      <rect
        x="2.5"
        y="4.5"
        width="19"
        height="15"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Precision Ledger 'T' Bar */}
      <path
        d="M7 9.5H17"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12 9.5V15.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {/* Secure coin/chip point */}
      <circle cx="16.5" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  size = "md",
  showText = true,
  className,
  ...props
}: LogoProps) {
  const iconPixelSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div
      className={cn("inline-flex items-center gap-2.5 select-none", className)}
      {...props}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white shadow-sm transition-transform hover:scale-[1.03]">
        <LogoIcon size={iconPixelSizes[size]} className="text-white" />
      </div>

      {showText && (
        <span
          className={cn(
            "font-extrabold tracking-tight text-zinc-950",
            textSizes[size]
          )}
        >
          Tama<span className="font-normal text-zinc-500">Wallet</span>
        </span>
      )}
    </div>
  );
}
