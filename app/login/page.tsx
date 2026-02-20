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
import { useForm, Controller } from "react-hook-form";
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

  const {
    control: controlSignIn,
    handleSubmit: handleSubmitSignIn,
    formState: {
      isValid: isSignInValid,
      isSubmitting: isSignInSubmitting,
      isDirty: isSignInDirty,
    },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignInSubmit = async (value: any) => {
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
  };

  const {
    control: controlSignUp,
    handleSubmit: handleSubmitSignUp,
    formState: {
      isValid: isSignUpValid,
      isSubmitting: isSignUpSubmitting,
      isValidating: isSignUpValidating,
      isDirty: isSignUpDirty,
    },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSignUpSubmit = async (value: any) => {
    setLoading(true);
    await signUp.email({
      email: value.email,
      password: value.password,
      name: value.name,
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

  const signInDisabled =
    (!isSignInValid && isSignInDirty) || isSignInSubmitting || loading;

  const signUpDisabled =
    (!isSignUpValid && isSignUpDirty) ||
    isSignUpSubmitting ||
    loading ||
    isSignUpValidating;

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
                onSubmit={handleSubmitSignIn(onSignInSubmit)}
                noValidate
                className="space-y-4"
              >
                <FieldGroup>
                  <FieldSet>
                    <Controller
                      name="email"
                      control={controlSignIn}
                      rules={{ required: "L'email est requis" }}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            type="email"
                            aria-invalid={fieldState.invalid}
                            placeholder="noah@badomens.com"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="password"
                      control={controlSignIn}
                      rules={{ required: "Le mot de passe est requis" }}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            Mot de passe
                          </FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            type="password"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldSet>
                </FieldGroup>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                form="signin-form"
                type="submit"
                className="w-full"
                disabled={signInDisabled}
              >
                Se connecter
                {isSignInSubmitting && <Spinner />}
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
                {loading && <Spinner className="ml-2 " />}
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
                onSubmit={handleSubmitSignUp(onSignUpSubmit)}
                noValidate
                className="space-y-4"
              >
                <FieldGroup>
                  <FieldSet>
                    <Controller
                      name="name"
                      control={controlSignUp}
                      rules={{ required: "Le nom est requis" }}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>Nom</FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="Noah"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="username"
                      control={controlSignUp}
                      rules={{
                        required: "Le nom d'utilisateur est requis",
                        minLength: {
                          value: 3,
                          message: "Top court (min 3 caractères)",
                        },
                        maxLength: {
                          value: 31,
                          message: "Trop long (max 31 caractères)",
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9_]+$/,
                          message:
                            "Caractères invalides (lettres, chiffres, tirets du bas)",
                        },
                        validate: async (value) => {
                          const cleanUsername = value.toLowerCase().trim();
                          if (!cleanUsername) return true;
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
                          return true;
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            Nom d'utilisateur
                          </FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...field}
                              id={field.name}
                              aria-invalid={fieldState.invalid}
                              placeholder="noahsebastian"
                            />
                            <InputGroupAddon align="inline-end">
                              {isSignUpValidating && (
                                <Spinner className="text-muted-foreground animate-spin " />
                              )}
                              {fieldState.isTouched &&
                                !isSignUpValidating &&
                                !fieldState.invalid &&
                                fieldState.isDirty && (
                                  <Check className="text-green-500 " />
                                )}
                              {fieldState.invalid && (
                                <X className="text-destructive " />
                              )}
                            </InputGroupAddon>
                          </InputGroup>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="email"
                      control={controlSignUp}
                      rules={{
                        required: "L'email est requis",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Adresse email invalide",
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            type="email"
                            aria-invalid={fieldState.invalid}
                            placeholder="noah@badomens.com"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="password"
                      control={controlSignUp}
                      rules={{
                        required: "Le mot de passe est requis",
                        minLength: {
                          value: 8,
                          message: "8 caractères minimum requis",
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            Mot de passe
                          </FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            type="password"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldSet>
                </FieldGroup>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                form="signup-form"
                type="submit"
                className="w-full"
                disabled={signUpDisabled}
              >
                S'inscrire
                {isSignUpSubmitting && <Spinner />}
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
