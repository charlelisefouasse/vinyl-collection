"use client";

import { useState } from "react";
import { signIn, signUp, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signInForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      await signIn.email({
        email: value.email,
        password: value.password,
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
    },
  });

  const signUpForm = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      await signUp.email({
        email: value.email,
        password: value.password,
        name: value.name,
        // @ts-ignore
        username: value.username.toLowerCase().trim(),
        callbackURL: "/",
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
    },
  });

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
            <CardContent>
              <form
                id="signin-form"
                onSubmit={() => {
                  signInForm.handleSubmit();
                }}
                noValidate
                className="space-y-4"
              >
                <FieldGroup>
                  <FieldSet>
                    <signInForm.Field
                      name="email"
                      validators={{
                        onBlur: ({ value }) =>
                          !value ? "L'email est requis" : undefined,
                      }}
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !!field.state.meta.errors.length;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel>Email</FieldLabel>
                            <Input
                              type="email"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              placeholder="noah@badomens.com"
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
                    <signInForm.Field
                      name="password"
                      validators={{
                        onBlur: ({ value }) =>
                          !value ? "Le mot de passe est requis" : undefined,
                      }}
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !!field.state.meta.errors.length;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel>Mot de passe</FieldLabel>
                            <Input
                              type="password"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
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
                  </FieldSet>
                </FieldGroup>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <signInForm.Subscribe
                selector={(state) =>
                  [state.canSubmit, state.isSubmitting, state.values] as const
                }
                children={([canSubmit, isSubmitting, values]) => {
                  const hasRequired =
                    !!values.email?.trim() && !!values.password?.trim();
                  return (
                    <Button
                      form="signin-form"
                      type="submit"
                      className="w-full"
                      disabled={
                        !canSubmit || isSubmitting || loading || !hasRequired
                      }
                    >
                      Se connecter
                      {isSubmitting && (
                        <Spinner className="ml-2 h-4 w-4 animate-spin" />
                      )}
                    </Button>
                  );
                }}
              />
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
            <CardContent>
              <form
                id="signup-form"
                onSubmit={(e) => {
                  signUpForm.handleSubmit();
                }}
                noValidate
                className="space-y-4"
              >
                <FieldGroup>
                  <FieldSet>
                    <signUpForm.Field
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
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
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

                    <signUpForm.Field
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
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                onBlur={field.handleBlur}
                                placeholder="noahsebastian"
                                aria-invalid={isInvalid}
                              />
                              <InputGroupAddon align="inline-end">
                                {isChecking && (
                                  <Spinner className="text-muted-foreground animate-spin" />
                                )}
                                {isValidAndChecked && (
                                  <Check className="text-green-500" />
                                )}
                                {isInvalid && (
                                  <X className="text-destructive" />
                                )}
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

                    <signUpForm.Field
                      name="email"
                      validators={{
                        onBlur: ({ value }) => {
                          if (!value) return "L'email est requis";
                          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                            return "Adresse email invalide";
                          return undefined;
                        },
                      }}
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !!field.state.meta.errors.length;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel>Email</FieldLabel>
                            <Input
                              type="email"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              placeholder="noah@badomens.com"
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

                    <signUpForm.Field
                      name="password"
                      validators={{
                        onBlur: ({ value }) => {
                          if (!value) return "Le mot de passe est requis";
                          if (value.length < 8)
                            return "8 caractères minimum requis";
                          return undefined;
                        },
                      }}
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !!field.state.meta.errors.length;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel>Mot de passe</FieldLabel>
                            <Input
                              type="password"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
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
                  </FieldSet>
                </FieldGroup>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <signUpForm.Subscribe
                selector={(state) =>
                  [state.canSubmit, state.isSubmitting, state.values] as const
                }
                children={([canSubmit, isSubmitting, values]) => {
                  const hasRequired =
                    !!values.name?.trim() &&
                    !!values.username?.trim() &&
                    !!values.email?.trim() &&
                    !!values.password?.trim();
                  return (
                    <Button
                      form="signup-form"
                      type="submit"
                      className="w-full"
                      disabled={
                        !canSubmit || isSubmitting || loading || !hasRequired
                      }
                    >
                      S'inscrire
                      {isSubmitting && <Spinner />}
                    </Button>
                  );
                }}
              />

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
