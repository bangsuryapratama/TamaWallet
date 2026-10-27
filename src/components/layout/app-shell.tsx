"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { TopBar } from "./top-bar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Workspace */}
      <div className="flex flex-col md:pl-60 min-h-screen">
        <TopBar />
        <main className="flex-1 p-4 md:p-8 pb-28 md:pb-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
