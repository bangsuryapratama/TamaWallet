import * as React from "react";
import { Banknote } from "lucide-react";

export interface BankLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string | undefined;
  size?: number | undefined;
  monochrome?: boolean | undefined;
}

/**
 * Logo Resmi Bank Central Asia (BCA)
 * Menggunakan asset logo resmi Grup BCA yang 100% otentik
 */
export function BcaLogo({ className = "h-5 w-auto", size, monochrome = false, style }: BankLogoProps) {
  const pixelHeight = size || 18;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logos/bca.png?v=3"
      alt="Bank Central Asia (BCA)"
      className={`h-4.5 max-h-5 w-auto max-w-[85px] object-contain shrink-0 ${className}`}
      style={{
        height: `${pixelHeight}px`,
        maxHeight: `${pixelHeight}px`,
        maxWidth: "85px",
        width: "auto",
        objectFit: "contain",
        filter: monochrome ? "brightness(0) invert(1)" : undefined,
        ...style,
      }}
      loading="eager"
    />
  );
}

/**
 * Logo Resmi Bank Mandiri
 */
export function MandiriLogo({ className = "h-6 w-auto", size, monochrome = false, ...props }: BankLogoProps) {
  const primaryColor = monochrome ? "currentColor" : "#003D79";
  const yellowColor = monochrome ? "currentColor" : "#FDB813";
  return (
    <svg
      viewBox="0 0 120 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { height: size, width: "auto" } : undefined}
      {...props}
    >
      <path
        d="M92 4C98 4 107 8 116 16C108 14 100 16 93 21C97 15 103 12 110 10C104 8 98 7 92 4Z"
        fill={yellowColor}
      />
      <text
        x="2"
        y="24"
        fill={primaryColor}
        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
        fontWeight="800"
        fontSize="21"
        letterSpacing="-0.5"
      >
        mandırı
      </text>
    </svg>
  );
}

/**
 * Logo Resmi Bank Jago
 * Menggunakan asset logo resmi Bank Jago yang 100% otentik
 */
export function JagoLogo({ className = "h-5 w-auto", size, monochrome = false, style }: BankLogoProps) {
  const pixelHeight = size || 18;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logos/jago.png?v=3"
      alt="Bank Jago"
      className={`h-4.5 max-h-5 w-auto max-w-[85px] object-contain shrink-0 ${className}`}
      style={{
        height: `${pixelHeight}px`,
        maxHeight: `${pixelHeight}px`,
        maxWidth: "85px",
        width: "auto",
        objectFit: "contain",
        filter: monochrome ? "brightness(0) invert(1)" : undefined,
        ...style,
      }}
      loading="eager"
    />
  );
}

/**
 * Logo Resmi Bank BRI
 */
export function BriLogo({ className = "h-6 w-auto", size, monochrome = false, ...props }: BankLogoProps) {
  const primaryColor = monochrome ? "currentColor" : "#00529C";
  return (
    <svg
      viewBox="0 0 95 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { height: size, width: "auto" } : undefined}
      {...props}
    >
      <rect x="1" y="2" width="28" height="28" rx="8" fill={primaryColor} />
      <text
        x="6"
        y="22"
        fill="#FFFFFF"
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
        fontWeight="900"
        fontSize="15"
      >
        BR
      </text>
      <text
        x="34"
        y="24"
        fill={primaryColor}
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
        fontWeight="900"
        fontSize="23"
        letterSpacing="-0.5"
      >
        BRI
      </text>
    </svg>
  );
}

/**
 * Logo Resmi Bank BNI
 */
export function BniLogo({ className = "h-6 w-auto", size, monochrome = false, ...props }: BankLogoProps) {
  const tealColor = monochrome ? "currentColor" : "#005E6A";
  const orangeColor = monochrome ? "currentColor" : "#F15A24";
  return (
    <svg
      viewBox="0 0 95 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { height: size, width: "auto" } : undefined}
      {...props}
    >
      <text
        x="2"
        y="24"
        fill={tealColor}
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
        fontWeight="900"
        fontSize="24"
        letterSpacing="-0.5"
      >
        BNI
      </text>
      <path
        d="M58 5L71 27H65L61 19H53V27H48V5H58ZM53 10V15H59L56 10H53Z"
        fill={orangeColor}
      />
    </svg>
  );
}

/**
 * Logo Resmi GoPay
 * Menggunakan asset logo resmi GoPay yang 100% otentik
 */
export function GopayLogo({ className = "h-5 w-auto", size, monochrome = false, style }: BankLogoProps) {
  const pixelHeight = size || 18;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logos/gopay.png?v=3"
      alt="GoPay"
      className={`h-4.5 max-h-5 w-auto max-w-[85px] object-contain shrink-0 ${className}`}
      style={{
        height: `${pixelHeight}px`,
        maxHeight: `${pixelHeight}px`,
        maxWidth: "85px",
        width: "auto",
        objectFit: "contain",
        filter: monochrome ? "brightness(0) invert(1)" : undefined,
        ...style,
      }}
      loading="eager"
    />
  );
}

/**
 * Logo Resmi OVO
 */
export function OvoLogo({ className = "h-6 w-auto", size, monochrome = false, ...props }: BankLogoProps) {
  const primaryColor = monochrome ? "currentColor" : "#4C3494";
  return (
    <svg
      viewBox="0 0 90 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { height: size, width: "auto" } : undefined}
      {...props}
    >
      <text
        x="2"
        y="25"
        fill={primaryColor}
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
        fontWeight="900"
        fontSize="26"
        letterSpacing="2"
      >
        OVO
      </text>
    </svg>
  );
}

/**
 * Logo Resmi DANA
 */
export function DanaLogo({ className = "h-6 w-auto", size, monochrome = false, ...props }: BankLogoProps) {
  const primaryColor = monochrome ? "currentColor" : "#118EEA";
  return (
    <svg
      viewBox="0 0 95 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { height: size, width: "auto" } : undefined}
      {...props}
    >
      <rect x="2" y="4" width="24" height="24" rx="7" fill={primaryColor} />
      <path
        d="M8 10H14C17.5 10 19 12 19 16C19 20 17.5 22 14 22H8V10ZM11.5 13V19H14C15.8 19 16.5 18 16.5 16C16.5 14 15.8 13 14 13H11.5Z"
        fill="#FFFFFF"
      />
      <text
        x="31"
        y="23"
        fill={primaryColor}
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
        fontWeight="900"
        fontSize="21"
        letterSpacing="0.5"
      >
        DANA
      </text>
    </svg>
  );
}

/**
 * Logo Resmi ShopeePay
 */
export function ShopeePayLogo({ className = "h-6 w-auto", size, monochrome = false, ...props }: BankLogoProps) {
  const primaryColor = monochrome ? "currentColor" : "#EE4D2D";
  return (
    <svg
      viewBox="0 0 120 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { height: size, width: "auto" } : undefined}
      {...props}
    >
      <rect x="2" y="4" width="24" height="24" rx="7" fill={primaryColor} />
      <path
        d="M14 8C11.5 8 10 9.2 10 11C10 14 18 13 18 16C18 18 16 19 14 19C11.5 19 10.5 17.5 10.5 17.5L9.5 19C10.5 20 12 20.5 14 20.5C16.8 20.5 19.5 19 19.5 16C19.5 13 11.5 13.8 11.5 11C11.5 9.8 12.8 9.2 14 9.2C16 9.2 17 10.2 17 10.2L18 8.8C17 7.8 15.5 8 14 8Z"
        fill="#FFFFFF"
      />
      <text
        x="31"
        y="23"
        fill={primaryColor}
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
        fontWeight="800"
        fontSize="19"
        letterSpacing="-0.3"
      >
        ShopeePay
      </text>
    </svg>
  );
}

/**
 * Registry Ikon Bank
 */
export function BankBrandLogo({
  code,
  className = "h-6 w-auto",
  size,
  monochrome = false,
}: {
  code: string;
  className?: string | undefined;
  size?: number | undefined;
  monochrome?: boolean | undefined;
}) {
  const normalized = code.toLowerCase().trim();
  switch (normalized) {
    case "bca":
      return <BcaLogo className={className} size={size} monochrome={monochrome} />;
    case "mandiri":
      return <MandiriLogo className={className} size={size} monochrome={monochrome} />;
    case "jago":
      return <JagoLogo className={className} size={size} monochrome={monochrome} />;
    case "bri":
      return <BriLogo className={className} size={size} monochrome={monochrome} />;
    case "bni":
      return <BniLogo className={className} size={size} monochrome={monochrome} />;
    case "gopay":
      return <GopayLogo className={className} size={size} monochrome={monochrome} />;
    case "ovo":
      return <OvoLogo className={className} size={size} monochrome={monochrome} />;
    case "dana":
      return <DanaLogo className={className} size={size} monochrome={monochrome} />;
    case "shopeepay":
      return <ShopeePayLogo className={className} size={size} monochrome={monochrome} />;
    default:
      return null;
  }
}

/**
 * Badge Platter Resmi Bank untuk Tampil Maksimal di Semua Warna Kartu
 * Memberikan background putih glossy kontras tinggi agar logo 100% terbaca jelas.
 */
export function BankCardBadge({
  provider,
  className = "",
}: {
  provider: string;
  className?: string;
}) {
  if (provider === "cash") {
    return (
      <div className={`h-8 px-2.5 rounded-xl bg-white shadow-md flex items-center gap-1.5 text-zinc-950 font-black text-[11px] sm:text-xs shrink-0 ${className}`}>
        <Banknote className="h-3.5 w-3.5 text-emerald-600 stroke-[2.2]" />
        <span>TUNAI</span>
      </div>
    );
  }

  return (
    <div className={`h-8 px-2.5 rounded-xl bg-white shadow-md flex items-center justify-center border border-white/60 shrink-0 max-w-[90px] overflow-hidden ${className}`}>
      <BankBrandLogo code={provider} className="h-4.5 w-auto max-h-4.5 max-w-[80px]" size={18} monochrome={false} />
    </div>
  );
}
