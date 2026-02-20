"use client";

import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlbumUI } from "@/types/spotify";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDeleteAlbum } from "@/services/albums/service";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

interface AlbumFormProps {
  album: AlbumUI;
  onSubmit: (paylaod: AlbumUI) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export function AlbumForm({
  album,
  onSubmit,
  onCancel,
  isLoading,
  mode = "create",
}: AlbumFormProps) {
  const router = useRouter();

  const deleteAlbum = useDeleteAlbum({
    onSuccess: () => {
      toast.success("Album supprimé");
      router.back();
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const handleDelete = () => {
    deleteAlbum.mutate(album.id);
  };

  const form = useForm({
    defaultValues: {
      name: album.name || "",
      artist: album.artist || "",
      variant: album.variant || "",
      genres: album.genres?.join(", ") || "",
      release_date: album.release_date || "",
      type: album.type || "collection",
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...album,
        ...value,
        genres: value.genres
          ? value.genres.split(",").map((g) => g.trim())
          : [],
        id: album.id || uuid(),
      };
      onSubmit(payload);
    },
  });

  const isSubmitting = form.state.isSubmitting || isLoading || isLoading;

  return (
    <form
      onSubmit={() => {
        form.handleSubmit();
      }}
      noValidate
      className="space-y-6"
    >
      <FieldGroup>
        <FieldSet>
          <form.Field
            name="name"
            validators={{
              onBlur: ({ value }) =>
                !value ? "Le nom de l'album est requis" : undefined,
            }}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Nom</FieldLabel>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Nom de l'album"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError
                      errors={field.state.meta.errors?.map((err) => ({
                        message: err?.toString(),
                      }))}
                    />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="artist"
            validators={{
              onBlur: ({ value }) =>
                !value ? "Le nom de l'artiste est requis" : undefined,
            }}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Artiste</FieldLabel>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Artistes (séparés par des virgules)"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError
                      errors={field.state.meta.errors?.map((err) => ({
                        message: err?.toString(),
                      }))}
                    />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="release_date"
            children={(field) => (
              <Field>
                <FieldLabel>Date de sortie</FieldLabel>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Date de sortie"
                />
              </Field>
            )}
          />

          <form.Field
            name="variant"
            children={(field) => (
              <Field>
                <FieldLabel>Variante</FieldLabel>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Variante du vinyle"
                />
              </Field>
            )}
          />

          <form.Field
            name="genres"
            children={(field) => (
              <Field>
                <FieldLabel>Genres</FieldLabel>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Genres (séparés par des virgules)"
                />
              </Field>
            )}
          />

          <form.Field
            name="type"
            children={(field) => (
              <Field>
                <FieldLabel>Type</FieldLabel>
                <RadioGroup
                  onValueChange={(val) =>
                    field.handleChange(val as "collection" | "wishlist")
                  }
                  defaultValue={field.state.value}
                  className="flex gap-3"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="collection" id="collection" />
                    <FieldLabel htmlFor="collection" className="font-normal">
                      Collection
                    </FieldLabel>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="wishlist" id="wishlist" />
                    <FieldLabel htmlFor="wishlist" className="font-normal">
                      Wishlist
                    </FieldLabel>
                  </div>
                </RadioGroup>
              </Field>
            )}
          />
        </FieldSet>
      </FieldGroup>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        {mode === "edit" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 />
                <span className="hidden md:flex">Supprimer</span>
                {deleteAlbum.isPending && <Spinner />}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Cela supprimera l'album de
                  votre collection.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <form.Subscribe
          selector={(state) =>
            [state.canSubmit, state.isSubmitting, state.values] as const
          }
          children={([canSubmit, isSubmittingState, values]) => {
            const hasRequired =
              !!values.name?.trim() && !!values.artist?.trim();
            const disabled =
              !canSubmit || isSubmitting || isSubmittingState || !hasRequired;
            return (
              <Button type="submit" disabled={disabled}>
                {mode === "create" ? (
                  <>
                    <Plus />
                    Ajouter
                  </>
                ) : (
                  "Enregistrer"
                )}
                {isSubmittingState && <Spinner />}
              </Button>
            );
          }}
        />
      </div>
    </form>
  );
}
