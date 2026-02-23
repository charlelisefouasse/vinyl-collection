"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { useForm, Controller } from "react-hook-form";
import { useUpdateUser } from "@/services/users/service";
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

interface FormValues {
  name: string;
  username: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, isSubmitting, isValidating },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      username: "",
    },
  });

  const { mutate: updateUserMutation, isPending: isUpdating } = useUpdateUser();

  const onSubmit = (value: FormValues) => {
    updateUserMutation(
      {
        name: value.name,
        username: value.username.toLowerCase().trim(),
      },
      {
        onSuccess: () => {
          toast.success("Profil configuré !");
          router.replace("/");
        },
        onError: (err: any) => {
          toast.error(err.message || "Erreur inattendue");
        },
      },
    );
  };

  const nameValue = watch("name");
  useEffect(() => {
    if (session?.user?.name && !nameValue) {
      setValue("name", session.user.name, {
        shouldValidate: true,
        shouldTouch: true,
      });
    }
  }, [session, setValue, nameValue]);

  if (isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const disabled = !isValid || isSubmitting || isValidating || isUpdating;

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
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            <FieldGroup>
              <FieldSet>
                <Controller
                  name="name"
                  control={control}
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
                  control={control}
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
                          {isValidating && (
                            <Spinner className="text-muted-foreground" />
                          )}
                          {fieldState.isTouched &&
                            !isValidating &&
                            !fieldState.invalid &&
                            fieldState.isDirty && (
                              <Check className="text-green-500 " />
                            )}
                          {fieldState.invalid && (
                            <X className="text-destructive" />
                          )}
                        </InputGroupAddon>
                      </InputGroup>
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
        <CardFooter>
          <Button
            form="onboarding-form"
            type="submit"
            className="w-full"
            disabled={disabled}
          >
            Continuer
            {(isSubmitting || isUpdating) && (
              <Spinner className="ml-2  animate-spin" />
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
