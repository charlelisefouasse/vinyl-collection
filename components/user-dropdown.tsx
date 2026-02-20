"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut, Music, User, LogIn } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserDropdown() {
  const session = useSession();
  const user = session.data?.user as { username?: string } | undefined;

  if (session.isPending) {
    return null;
  }

  if (!user?.username) {
    return (
      <Button asChild className="size-9 md:h-8 md:w-auto md:px-3 rounded-full">
        <Link href="/login">
          <LogIn />
          <span className="hidden md:inline">Se connecter</span>
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full shrink-0">
          <User />
          <span className="sr-only">Menu utilisateur</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/${user.username}`}>
            <Music />
            Ma collection
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()} variant="destructive">
          <LogOut />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
