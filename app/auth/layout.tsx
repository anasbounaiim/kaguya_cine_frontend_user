// app/auth/layout.tsx  – shared dark layout
"use client";

import "../globals.css";   
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      {children}
    </main>
  );
}
