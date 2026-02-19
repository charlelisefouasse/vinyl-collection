"use client";

import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlbumUI } from "@/types/spotify";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useAddToCollection,
  useAddToWishlist,
} from "@/services/albums/service";

interface AddAlbumFormProps {
  album: AlbumUI;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddAlbumForm({
  album,
  onSuccess,
  onCancel,
}: AddAlbumFormProps) {
  const addToCollection = useAddToCollection({
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while adding to collection",
      );
    },
    onSuccess: () => {
      toast.success("Album added to collection successfully!");
      onSuccess();
    },
  });

  const addToWishlist = useAddToWishlist({
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while adding to wishlist",
      );
    },
    onSuccess: () => {
      toast.success("Album added to wishlist successfully!");
      onSuccess();
    },
  });

  const form = useForm({
    defaultValues: {
      name: album.name || "",
      artist: album.artist || "",
      variant: "",
      genres: "",
      release_date: album.release_date || "",
      destination: "collection" as "collection" | "wishlist",
    },
    onSubmit: async ({ value }) => {
      const { destination, ...values } = value;
      const payload = {
        ...album,
        ...values,
        genres: values.genres ? values.genres.split(",") : [],
        id: album.id || uuid(),
      };

      if (destination === "wishlist") {
        addToWishlist.mutate(payload);
      } else {
        addToCollection.mutate(payload);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldSet>
        <FieldGroup>
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value ? "Album name is required" : undefined,
            }}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Album name"
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
              onChange: ({ value }) =>
                !value ? "Artist name is required" : undefined,
            }}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !!field.state.meta.errors.length;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Artist</FieldLabel>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Artists (comma separated)"
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
                <FieldLabel>Release Date</FieldLabel>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Release date"
                />
              </Field>
            )}
          />

          <form.Field
            name="variant"
            children={(field) => (
              <Field>
                <FieldLabel>Variant</FieldLabel>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Vinyle variant"
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
                  placeholder="Genres (comma separated)"
                />
              </Field>
            )}
          />

          <form.Field
            name="destination"
            children={(field) => (
              <Field>
                <FieldLabel>Destination</FieldLabel>
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
                      Ma Collection
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
        </FieldGroup>

        <div className="flex gap-4 pt-6 place-content-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button
            disabled={addToCollection.isPending || addToWishlist.isPending}
            type="submit"
            className="gap-2"
          >
            {addToCollection.isPending || addToWishlist.isPending ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Ajouter
              </>
            )}
          </Button>
        </div>
      </FieldSet>
    </form>
  );
}
