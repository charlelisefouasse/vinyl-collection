import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [usernameClient(), inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, useSession, signOut } = authClient;
