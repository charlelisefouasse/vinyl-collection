"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
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
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

import { ArrowLeft, MonitorSmartphone, Moon, Sun } from "lucide-react";
import { Header } from "@/components/header";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AccountFormValues {
  name: string;
  theme: string;
}

export default function AccountPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { setTheme } = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, isDirty },
  } = useForm<AccountFormValues>({
    defaultValues: {
      name: "",
      theme: "system",
    },
  });

  useEffect(() => {
    if (session?.user) {
      reset({
        name: session.user.name || "",
        theme: session.user.theme || "system",
      });
    }
  }, [session, reset]);

  const onSubmit = (value: AccountFormValues) => {
    updateUser(
      {
        name: value.name,
        theme: value.theme,
      },
      {
        onSuccess: () => {
          toast.success("Compte mis à jour !");
        },
        onError: (err: any) => {
          toast.error(err.message || "Erreur lors de la mise à jour");
        },
      },
    );
  };

  if (isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const user = session?.user;

  if (!user) {
    return null; // Will likely redirect via middleware, but safe fallback
  }

  return (
    <>
      <Header hideUserDropdown hideLogo>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            size="icon"
            className="shrink-0"
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-xl md:text-2xl font-bold">Compte</h1>
        </div>
      </Header>
      <main className="container mx-auto px-4 py-8">
        <div className="container max-w-2xl mx-auto py-12 px-4">
          <Card>
            <CardHeader>
              <CardTitle>Mon compte</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles et vos préférences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                id="account-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FieldGroup>
                  <FieldSet>
                    <Field>
                      <FieldLabel>Nom d'utilisateur</FieldLabel>
                      <div className="text-sm">{user.username || ""}</div>
                    </Field>
                    <Field>
                      <FieldLabel>Adresse email</FieldLabel>
                      <div className="text-sm">{user.email || ""}</div>
                    </Field>

                    {/* Editable fields */}
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
                            placeholder="Votre nom"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="theme"
                      control={control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Thème</FieldLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setTheme(value);
                            }}
                            value={field.value}
                          >
                            <SelectTrigger className="max-w-40">
                              <SelectValue placeholder="Thème" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="light">
                                  <Sun />
                                  Light
                                </SelectItem>
                                <SelectItem value="dark">
                                  <Moon />
                                  Dark
                                </SelectItem>
                                <SelectItem value="system">
                                  <MonitorSmartphone />
                                  Appareil
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    />
                  </FieldSet>
                </FieldGroup>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                form="account-form"
                disabled={!isDirty || !isValid || isSubmitting || isUpdating}
              >
                Sauvegarder
                {(isSubmitting || isUpdating) && (
                  <Spinner className="ml-2 animate-spin" />
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
}
