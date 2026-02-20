"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { LogoFull } from "@/components/ui/logo-full";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);

  // Pre-fill with name from Google if available
  const [name, setName] = useState(session?.user?.name || "");
  const [username, setUsername] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !name.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (usernameError) {
      toast.error(usernameError);
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: name,
        username: username.toLowerCase().trim(),
      });

      if (error) {
        toast.error(error.message || "Erreur lors de la mise à jour");
        setLoading(false);
        return;
      }

      toast.success("Profil configuré !");
      window.location.href = "/";
    } catch (err: any) {
      toast.error(err.message || "Erreur inattendue");
      setLoading(false);
    }
  };

  const isSubmitDisabled = loading || checkingUsername;

  return (
    <div className="flex min-h-dvh items-center justify-center p-4 flex-col gap-12">
      <LogoFull className="h-18 w-auto text-black dark:text-slate-100" />
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Dernière étape ! 🚀</CardTitle>
          <CardDescription>
            Choisissez un nom d'utilisateur pour votre profil public.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="onboarding-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Noah"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className={usernameError ? "text-destructive" : ""}
              >
                Nom d'utilisateur
              </Label>
              <InputGroup>
                <InputGroupInput
                  id="username"
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
                  placeholder="noahsebastian"
                  aria-invalid={!!usernameError}
                />
                <InputGroupAddon align="inline-end">
                  {!isUsernameFocused && checkingUsername && (
                    <Spinner className="text-muted-foreground" />
                  )}
                  {!isUsernameFocused &&
                    !checkingUsername &&
                    username &&
                    !usernameError && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  {!isUsernameFocused && !checkingUsername && usernameError && (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                </InputGroupAddon>
              </InputGroup>
              {usernameError && (
                <p className="text-sm font-medium text-destructive">
                  {usernameError}
                </p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            form="onboarding-form"
            type="submit"
            className="w-full"
            disabled={isSubmitDisabled}
          >
            Continuer
            {loading && <Spinner />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
