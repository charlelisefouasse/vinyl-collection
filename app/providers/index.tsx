"use client";

import ReactQueryProvider from "@/app/providers/tanstack-query";

import { ThemeProvider, useTheme } from "next-themes";
import { OnboardingGuard } from "@/components/onboarding-guard";

import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";

function ThemeSync({ sessionTheme }: { sessionTheme: string }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Only update if we actually have a theme from the session
    if (sessionTheme && sessionTheme !== "system") {
      setTheme(sessionTheme);
    }
  }, [sessionTheme, setTheme]);

  return null; // This component doesn't render anything
}

function UserThemeProvider({
  children,
}: React.ComponentProps<typeof ThemeProvider>) {
  const { data: session } = useSession();

  const userTheme = session?.user?.theme ?? "system";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={userTheme}
      enableSystem
      disableTransitionOnChange
    >
      <ThemeSync sessionTheme={userTheme} />
      {children}
    </ThemeProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserThemeProvider>
      <ReactQueryProvider>
        <OnboardingGuard />
        {children}
      </ReactQueryProvider>
    </UserThemeProvider>
  );
}
