"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
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
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { LogoFull } from "@/components/ui/logo-full";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const { error } = await authClient.updateUser({
          name: value.name,
          username: value.username.toLowerCase().trim(),
        });

        if (error) {
          toast.error(error.message || "Erreur lors de la mise à jour");
          return;
        }

        toast.success("Profil configuré !");
        router.replace("/");
      } catch (err: any) {
        toast.error(err.message || "Erreur inattendue");
      }
    },
  });

  useEffect(() => {
    if (session?.user?.name && !form.state.values.name) {
      form.setFieldValue("name", session.user.name);
    }
  }, [session, form]);

  if (isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner />
      </div>
    );
  }

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
            onSubmit={() => {
              form.handleSubmit();
            }}
            noValidate
            className="space-y-4"
          >
            <FieldGroup>
              <FieldSet>
                <form.Field
                  name="name"
                  validators={{
                    onBlur: ({ value }) =>
                      !value.trim() ? "Le nom est requis" : undefined,
                  }}
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      !!field.state.meta.errors.length;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>Nom</FieldLabel>
                        <Input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Noah"
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError
                            errors={field.state.meta.errors.map((err) => ({
                              message: err?.toString() || "",
                            }))}
                          />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="username"
                  validators={{
                    onChange: ({ value }) => {
                      if (value.length > 31)
                        return "Trop long (max 31 caractères)";
                      if (!/^[a-zA-Z0-9_]+$/.test(value) && value)
                        return "Caractères invalides (lettres, chiffres, tirets du bas)";
                      return undefined;
                    },
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: async ({ value }) => {
                      const cleanUsername = value.toLowerCase().trim();
                      if (!cleanUsername) return undefined;
                      try {
                        const { data, error } =
                          await authClient.isUsernameAvailable({
                            username: cleanUsername,
                          });
                        if (error) return "Erreur lors de la vérification";
                        if (!data?.available)
                          return "Ce nom d'utilisateur est déjà pris";
                      } catch (e) {
                        return "Erreur lors de la vérification";
                      }
                      return undefined;
                    },
                    onBlur: ({ value }) => {
                      if (!value.trim())
                        return "Le nom d'utilisateur est requis";
                      if (value.length < 3)
                        return "Top court (min 3 caractères)";
                    },
                  }}
                  children={(field) => {
                    const isInvalid = !!field.state.meta.errors.length;
                    const isChecking = field.state.meta.isValidating;
                    const isValidAndChecked =
                      field.state.meta.isTouched &&
                      !isChecking &&
                      !field.state.meta.errors.length &&
                      field.state.value.length >= 3;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>Nom d'utilisateur</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            placeholder="noahsebastian"
                            aria-invalid={isInvalid}
                          />
                          <InputGroupAddon align="inline-end">
                            {isChecking && (
                              <Spinner className="text-muted-foreground" />
                            )}
                            {isValidAndChecked && (
                              <Check className="text-green-500" />
                            )}
                            {isInvalid && <X className="text-destructive" />}
                          </InputGroupAddon>
                        </InputGroup>
                        {isInvalid && (
                          <FieldError
                            errors={field.state.meta.errors.map((err) => ({
                              message: err?.toString() || "",
                            }))}
                          />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldSet>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <form.Subscribe
            selector={(state) =>
              [state.canSubmit, state.isSubmitting, state.values] as const
            }
            children={([canSubmit, isSubmitting, values]) => {
              const hasRequired =
                !!values.name?.trim() && !!values.username?.trim();
              return (
                <Button
                  form="onboarding-form"
                  type="submit"
                  className="w-full"
                  disabled={!canSubmit || isSubmitting || !hasRequired}
                >
                  Continuer
                  {isSubmitting && <Spinner />}
                </Button>
              );
            }}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
