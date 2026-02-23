"use client";

import { useSession } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function OnboardingGuard() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      const username = session.user.username;

      // If user is connected but lacks a username, force them to onboarding
      if (!username && pathname !== "/onboarding" && pathname !== "/login") {
        router.push("/onboarding");
        return;
      }

      // If user has a username, prevent them from accessing onboarding
      if (username && pathname === "/onboarding") {
        router.replace("/");
        return;
      }
    } else {
      // If not connected, protect the onboarding page
      if (pathname === "/onboarding") {
        router.replace("/login");
        return;
      }
    }
  }, [session, isPending, pathname, router]);
  return null;
}
