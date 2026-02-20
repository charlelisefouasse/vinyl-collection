"use client";

import { useSession } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/spinner";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      // @ts-ignore
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

    setIsReady(true);
  }, [session, isPending, pathname, router]);

  // Loading state while checking session initially
  if (!isReady && isPending) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner className=" text-muted-foreground w-8 h-8" />
      </div>
    );
  }

  // Prevent flashing content if we are about to redirect to onboarding
  if (
    session?.user &&
    !(session.user as any).username &&
    pathname !== "/onboarding" &&
    pathname !== "/login"
  ) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner className=" text-muted-foreground w-8 h-8" />
      </div>
    );
  }

  return <>{children}</>;
}
