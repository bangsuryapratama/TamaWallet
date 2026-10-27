"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors={false}
      toastOptions={{
        className:
          "font-sans !bg-white !text-zinc-900 !border !border-zinc-200 !shadow-[0_8px_30px_rgb(0,0,0,0.12)] !rounded-2xl !p-4 !gap-3 text-xs",
        duration: 3500,
      }}
    />
  );
}
