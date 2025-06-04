"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Connexion admin</h1>
      <Button onClick={() => signIn("google", { callbackUrl: "/create" })}>
        Se connecter avec Google
      </Button>
    </div>
  );
}
