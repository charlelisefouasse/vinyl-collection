"use client";

import ReactQueryProvider from "@/app/providers/tanstack-query";
import { AuthSessionProvider } from "@/app/providers/next-auth";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthSessionProvider>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </AuthSessionProvider>
    </ThemeProvider>
  );
}
