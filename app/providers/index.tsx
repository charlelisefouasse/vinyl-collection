"use client";

import ReactQueryProvider from "@/app/providers/tanstack-query";

import { ThemeProvider } from "next-themes";
import { OnboardingGuard } from "@/components/onboarding-guard";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReactQueryProvider>
        <OnboardingGuard>{children}</OnboardingGuard>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
