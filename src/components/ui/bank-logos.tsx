import * as React from "react";

interface BankLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string | undefined;
  size?: number | undefined;
  monochrome?: boolean | undefined;
}

/**
 * Logo Resmi Bank Central Asia (BCA)
 */
export function BcaLogo({ className = "h-5 w-auto", size, monochrome = false, ...props }: BankLogoProps) {
  const primaryColor = monochrome ? "currentColor" : "#0060AF";
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { height: size, width: "auto" } : undefined}
      {...props}
    >
      {/* BCA Emblem: Two interlocking stylized curved diamonds */}
      <path
        d="M12.5 7L24 18.5L12.5 30L1 18.5L12.5 7Z"
        fill={primaryColor}
      />
      <path
        d="M24 18.5L35.5 30H12.5L24 18.5Z"
        fill={monochrome ? "currentColor" : "#004B87"}
        opacity={monochrome ? 0.8 : 1}
      />
      {/* BCA Official Bold Letterforms */}
      <text
        x="42"
        y="28"
        fill={primaryColor}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="22"
        letterSpacing="-0.5"
      >
        BCA
      </text>
    </svg>
  );
}

/**
 * Logo Resmi Bank Mandiri
 */
export function MandiriLogo({ className = "h-5 w-auto", size, monochrome = false, ...props }: BankLogoProps) {
  const primaryColor = monochrome ? "currentColor" : "#003D79";
  const yellowColor = monochrome ? "currentColor" : "#FDB813";
  return (
    <svg
      viewBox="0 0 130 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { height: size, width: "auto" } : undefined}
      {...props}
    >
      {/* Mandiri Golden Ribbon */}
      <path
        d="M98 6C105 6 114 10 122 17C114 15 106 17 99 22C103 16 109 13 116 11C110 9 104 8 98 6Z"
        fill={yellowColor}
      />
      <text
        x="2"
        y="25"
        fill={primaryColor}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="20"
        letterSpacing="-0.5"
      >
        mandırı
      </text>
    </svg>
  );
}

/**
 * Logo Resmi Bank Jago
 */
export function JagoLogo({ className = "h-5 w-auto", size, monochrome = false, ...props }: BankLogoProps) {
  const orangeColor = monochrome ? "currentColor" : "#FFA800";
  return (
    <svg
      viewBox="0 0 100 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { height: size, width: "auto" } : undefined}
      {...props}
    >
      <circle cx="16" cy="18" r="14" fill={orangeColor} />
      <path
        d="M16 9C12 9 9 12 9 16C9 21 15 25 16 26C17 25 23 21 23 16C23 12 20 9 16 9Z"
        fill={monochrome ? "#000" : "#FFFFFF"}
      />
      <text
        x="36"
        y="25"
        fill={monochrome ? "currentColor" : "#1E1E1E"}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="20"
        letterSpacing="-0.5"
      >
        jago
      </text>
    </svg>
  );
}

/**
 * Logo Resmi Bank BRI
 */
export function BriLogo({ className = "h-5 w-auto", size, monochrome = false, ...props }: BankLogoProps) {
  const primaryColor = monochrome ? "currentColor" : "#00529C";
  return (
    <svg
      viewBox="0 0 100 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { height: size, width: "auto" } : undefined}
      {...props}
    >
      <rect x="2" y="4" width="28" height="28" rx="8" fill={primaryColor} />
      <text
        x="7"
        y="24"
        fill="#FFFFFF"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="14"
      >
        BR
      </text>
      <text
        x="36"
        y="25"
        fill={primaryColor}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="21"
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
export function BniLogo({ className = "h-5 w-auto", size, monochrome = false, ...props }: BankLogoProps) {
  const tealColor = monochrome ? "currentColor" : "#005E6A";
  const orangeColor = monochrome ? "currentColor" : "#F15A24";
  return (
    <svg
      viewBox="0 0 105 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { height: size, width: "auto" } : undefined}
      {...props}
    >
      <text
        x="2"
        y="25"
        fill={tealColor}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="22"
        letterSpacing="-0.5"
      >
        BNI
      </text>
      <path
        d="M62 7L74 29H68L64 21H56V29H51V7H62ZM56 12V17H62L59 12H56Z"
        fill={orangeColor}
      />
    </svg>
  );
}

/**
 * Logo Resmi GoPay
 */
export function GopayLogo({ className = "h-5 w-auto", size, monochrome = false, ...props }: BankLogoProps) {
  const primaryColor = monochrome ? "currentColor" : "#00AED6";
  return (
    <svg
      viewBox="0 0 110 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { height: size, width: "auto" } : undefined}
      {...props}
    >
      <circle cx="16" cy="18" r="13" fill={primaryColor} />
      <circle cx="16" cy="18" r="5" fill="#FFFFFF" />
      <text
        x="35"
        y="25"
        fill={monochrome ? "currentColor" : "#1C2430"}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="19"
        letterSpacing="-0.5"
      >
        gopay
      </text>
    </svg>
  );
}

/**
 * Logo Resmi OVO
 */
export function OvoLogo({ className = "h-5 w-auto", size, monochrome = false, ...props }: BankLogoProps) {
  const primaryColor = monochrome ? "currentColor" : "#4C3494";
  return (
    <svg
      viewBox="0 0 95 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { height: size, width: "auto" } : undefined}
      {...props}
    >
      <text
        x="2"
        y="26"
        fill={primaryColor}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="24"
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
export function DanaLogo({ className = "h-5 w-auto", size, monochrome = false, ...props }: BankLogoProps) {
  const primaryColor = monochrome ? "currentColor" : "#118EEA";
  return (
    <svg
      viewBox="0 0 100 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { height: size, width: "auto" } : undefined}
      {...props}
    >
      <rect x="2" y="6" width="24" height="24" rx="7" fill={primaryColor} />
      <path
        d="M8 12H14C17.5 12 19 14 19 18C19 22 17.5 24 14 24H8V12ZM11.5 15V21H14C15.8 21 16.5 20 16.5 18C16.5 16 15.8 15 14 15H11.5Z"
        fill="#FFFFFF"
      />
      <text
        x="32"
        y="25"
        fill={primaryColor}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="19"
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
export function ShopeePayLogo({ className = "h-5 w-auto", size, monochrome = false, ...props }: BankLogoProps) {
  const primaryColor = monochrome ? "currentColor" : "#EE4D2D";
  return (
    <svg
      viewBox="0 0 130 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { height: size, width: "auto" } : undefined}
      {...props}
    >
      <rect x="2" y="6" width="24" height="24" rx="7" fill={primaryColor} />
      <path
        d="M14 10C11.5 10 10 11.2 10 13C10 16 18 15 18 18C18 20 16 21 14 21C11.5 21 10.5 19.5 10.5 19.5L9.5 21C10.5 22 12 22.5 14 22.5C16.8 22.5 19.5 21 19.5 18C19.5 15 11.5 15.8 11.5 13C11.5 11.8 12.8 11.2 14 11.2C16 11.2 17 12.2 17 12.2L18 10.8C17 9.8 15.5 10 14 10Z"
        fill="#FFFFFF"
      />
      <text
        x="32"
        y="24"
        fill={primaryColor}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="17"
        letterSpacing="-0.3"
      >
        ShopeePay
      </text>
    </svg>
  );
}

/**
 * Registry Ikon Bank Berdasarkan Kode / Provider
 */
export function BankBrandLogo({
  code,
  className,
  size,
  monochrome = false,
}: {
  code: string;
  className?: string;
  size?: number;
  monochrome?: boolean;
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
