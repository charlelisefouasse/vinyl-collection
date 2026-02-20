"use client";

import { useState } from "react";
import { signIn, signUp, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { LogoFull } from "@/components/ui/logo-full";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const handleSignIn = async () => {
    setLoading(true);
    await signIn.email({
      email,
      password,
      callbackURL: "/",
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setLoading(false);
        },
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  const checkUsername = async (val: string) => {
    const cleanUsername = val.toLowerCase().trim();
    if (!cleanUsername) {
      setUsernameError(null);
      return;
    }

    setCheckingUsername(true);
    setUsernameError(null);

    try {
      const { data, error } = await authClient.isUsernameAvailable({
        username: cleanUsername,
      });

      if (error) {
        setUsernameError("Erreur lors de la vérification");
      } else if (!data?.available) {
        setUsernameError("Ce nom d'utilisateur est déjà pris");
      }
    } catch (e) {
      setUsernameError("Erreur lors de la vérification");
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleUsernameBlur = () => {
    if (username) {
      checkUsername(username);
    }
  };

  const handleSignUp = async () => {
    if (!name || !username || !email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (usernameError) {
      toast.error(usernameError);
      return;
    }
    setLoading(true);
    await signUp.email({
      email,
      password,
      name,
      // @ts-ignore
      username, // Ensure username is passed if schema requires it and you added it to better-auth config
      callbackURL: "/", // Maybe redirect to login or home
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setLoading(false);
        },
        onSuccess: () => {
          setLoading(false);
        },
      },
    });
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn.social({
      provider: "google",
      callbackURL: "/",
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setLoading(false);
        },
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 flex-col gap-12">
      <LogoFull className="h-18 w-auto text-black dark:text-slate-100" />
      <Tabs defaultValue="signin" className="max-w-md w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Connexion</TabsTrigger>
          <TabsTrigger value="signup">Inscription</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <Card>
            <CardHeader hidden>
              <CardTitle>Se connecter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="noah@badomens.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                className="w-full"
                onClick={handleSignIn}
                disabled={loading}
              >
                Se connecter
                {loading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
              </Button>
              <div className="flex justify-center">
                <span className="px-2 text-muted-foreground text-xs">OU</span>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Se connecter avec Google
                {loading && <Spinner />}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card>
            <CardHeader hidden>
              <CardTitle>S'inscrire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Nom</Label>
                <Input
                  id="signup-name"
                  placeholder="Noah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="signup-username"
                  className={usernameError ? "text-destructive" : ""}
                >
                  Nom d'utilisateur
                </Label>
                <InputGroup>
                  <InputGroupInput
                    id="signup-username"
                    placeholder="noahsebastian"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (usernameError) setUsernameError(null);
                    }}
                    onFocus={() => setIsUsernameFocused(true)}
                    onBlur={() => {
                      setIsUsernameFocused(false);
                      handleUsernameBlur();
                    }}
                    aria-invalid={!!usernameError}
                  />
                  <InputGroupAddon align="inline-end">
                    {!isUsernameFocused && checkingUsername && <Spinner />}
                    {!isUsernameFocused &&
                      !checkingUsername &&
                      username &&
                      !usernameError && <Check className="text-green-500" />}
                    {!isUsernameFocused &&
                      !checkingUsername &&
                      usernameError && <X className="text-destructive" />}
                  </InputGroupAddon>
                </InputGroup>
                {usernameError && (
                  <p className="text-sm font-medium text-destructive">
                    {usernameError}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="noah@badomens.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Mot de passe</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                className="w-full"
                onClick={handleSignUp}
                disabled={loading || checkingUsername}
              >
                S'inscrire
                {loading && <Spinner />}
              </Button>

              <div className="flex justify-center">
                <span className="px-2 text-muted-foreground text-xs">OU</span>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                S'inscrire avec Google
                {loading && <Spinner />}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
