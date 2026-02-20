"use client";

import { useForm, Controller } from "react-hook-form";
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

interface FormValues {
  name: string;
  artist: string;
  variant: string;
  genres: string;
  release_date: string;
  type: "collection" | "wishlist";
}

interface AlbumFormProps {
  album: AlbumUI;
  onSubmit: (payload: AlbumUI) => void;
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

  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      name: album.name || "",
      artist: album.artist || "",
      variant: album.variant || "",
      genres: album.genres?.join(", ") || "",
      release_date: album.release_date || "",
      type: (album.type as any) || "collection",
    },
  });

  const onFormSubmit = (value: FormValues) => {
    const payload = {
      ...album,
      ...value,
      genres: value.genres ? value.genres.split(",").map((g) => g.trim()) : [],
      id: album.id || uuid(),
    };
    onSubmit(payload);
  };

  const isSubmitting = form.formState.isSubmitting || isLoading;
  const disabled = !form.formState.isValid || isSubmitting;

  return (
    <form
      onSubmit={form.handleSubmit(onFormSubmit)}
      noValidate
      className="space-y-6"
    >
      <FieldGroup>
        <FieldSet>
          <Controller
            name="name"
            control={form.control}
            rules={{ required: "Le nom de l'album est requis" }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Nom</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Nom de l'album"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="artist"
            control={form.control}
            rules={{ required: "Le nom de l'artiste est requis" }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Artiste</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Artistes (séparés par des virgules)"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="release_date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Date de sortie</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Date de sortie"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="variant"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Variante</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Variante du vinyle"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="genres"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Genres</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Genres (séparés par des virgules)"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
              <Button type="button" variant="destructive">
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

        <Button type="submit" disabled={disabled}>
          {mode === "create" ? (
            <>
              <Plus />
              Ajouter
            </>
          ) : (
            "Enregistrer"
          )}
          {isSubmitting && <Spinner />}
        </Button>
      </div>
    </form>
  );
}
