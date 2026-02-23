"use client";

import { useSignInEmail, useSignInSocial } from "@/services/auth/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Spinner } from "@/components/ui/spinner";
import { LogoFull } from "@/components/ui/logo-full";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

export default function LoginPage() {
  const {
    control: controlSignIn,
    handleSubmit: handleSubmitSignIn,
    formState: { isValid, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: signInEmail, isPending: isEmailPending } = useSignInEmail();
  const { mutate: signInSocial, isPending: isSocialPending } =
    useSignInSocial();

  const loading = isEmailPending || isSocialPending;

  const onSignInSubmit = (value: any) => {
    signInEmail({
      email: value.email,
      password: value.password,
    });
  };

  const handleGoogleSignIn = () => {
    signInSocial({
      provider: "google",
    });
  };

  const signInDisabled = (!isValid && isDirty) || isSubmitting || loading;

  return (
    <div className="flex min-h-screen items-center justify-center p-4 flex-col gap-12">
      <LogoFull className="h-18 w-auto text-black dark:text-slate-100" />
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold leading-none tracking-tight text-center">
              Se connecter
            </CardTitle>
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
              {(isSubmitting || isEmailPending) && <Spinner />}
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
              {isSocialPending && <Spinner />}
            </Button>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="underline px-1">
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}
