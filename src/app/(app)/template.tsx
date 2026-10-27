"use client";

import * as React from "react";

export default function AppTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-page-enter w-full">
      {children}
    </div>
  );
}
