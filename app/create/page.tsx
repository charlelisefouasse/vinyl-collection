"use client";

import Image from "next/image";
import { useState } from "react";
import { useCreateAlbum, useGetAlbums } from "@/services/albums/service";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { AlbumUI } from "@/types/spotify";
import { v4 as uuid } from "uuid";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    redirect("/login");
  }

  const [searchTerm, setSearchTerm] = useState("");
  const searchAlbums = useGetAlbums(searchTerm);
  const [album, setAlbum] = useState<AlbumUI>();

  const createAlbum = useCreateAlbum({
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while creating the album"
      );
    },
    onSuccess: () => {
      toast.success("Album created successfully!");
      setAlbum(undefined);
      setSearchTerm("");
    },
  });

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      name: album?.name || "",
      artists: album?.artists || [],
      variant: "",
      genres: "",
      release_date: album?.release_date || "",
    },
    onSubmit: async ({ value }) => {
      if (album) {
        createAlbum.mutate({
          ...album,
          ...value,
          genres: value.genres ? value.genres.split(",") : [],
          id: album?.id || uuid(),
        });
      }
    },
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2  sm:items-start">
        <Link href="/">Retour</Link>
        <h1 className="text-2xl font-bold">Albums</h1>
        {!album ? (
          <>
            <input
              name="search"
              placeholder="Chercher un album"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <ul className="mt-4">
              {searchAlbums.isLoading && <div>Chargement...</div>}
              {searchAlbums.isError && (
                <div>Erreur lors de la recherche d&apos;album</div>
              )}
              {!searchAlbums.isLoading &&
                !!searchTerm &&
                !searchAlbums.data?.length && <div>Aucun résultat</div>}
              {!!searchAlbums.data?.length &&
                !searchAlbums.isLoading &&
                searchAlbums.data?.map((album) => (
                  <li key={album.id} className="mb-2">
                    {album.name} -{" "}
                    {album.artists.map((artist) => artist.name).join(", ")}
                    <Button onClick={() => setAlbum(album)}>Add</Button>
                    <Image src={album.image} alt="" width={200} height={200} />
                  </li>
                ))}
            </ul>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              console.log("cc");
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="gap-3 flex flex-col">
              <Field name="name">
                {({ state, handleChange, handleBlur }) => (
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={state.value}
                      onChange={(e) => handleChange(e.target.value)}
                      onBlur={handleBlur}
                      placeholder="Album name"
                    />
                  </div>
                )}
              </Field>
              <Field
                name="artists"
                // validators={{ onSubmit: ({ value }) => !!value }}
              >
                {({ state, handleChange, handleBlur }) => (
                  <div>
                    <Label>Artist</Label>
                    <Input
                      value={state.value
                        .map((artist) => artist.name)
                        .join(", ")}
                      onChange={(e) =>
                        handleChange(
                          e.target.value.split(",").map((name) => ({
                            name,
                            id: uuid(),
                            albumId: album.id,
                          }))
                        )
                      }
                      onBlur={handleBlur}
                      placeholder="Artists (comma separated)"
                    />
                  </div>
                )}
              </Field>
              <Field
                name="release_date"
                // validators={{ onSubmit: ({ value }) => !!value }}
              >
                {({ state, handleChange, handleBlur }) => (
                  <div>
                    <Label>Artist</Label>
                    <Input
                      value={state.value}
                      onChange={(e) => handleChange(e.target.value)}
                      onBlur={handleBlur}
                      placeholder="Release date"
                    />
                  </div>
                )}
              </Field>
              <Field name="variant">
                {({ state, handleChange, handleBlur }) => (
                  <div>
                    <Label>Artist</Label>
                    <Input
                      value={state.value}
                      onChange={(e) => handleChange(e.target.value)}
                      onBlur={handleBlur}
                      placeholder="Vinyle variant"
                    />
                  </div>
                )}
              </Field>
              <Field name="genres">
                {({ state, handleChange, handleBlur }) => (
                  <div>
                    <Label>Artist</Label>
                    <Input
                      value={state.value}
                      onChange={(e) => handleChange(e.target.value)}
                      onBlur={handleBlur}
                      placeholder="Genres (comma separated)"
                    />
                  </div>
                )}
              </Field>
            </div>
            <Button disabled={createAlbum.isPending} type="submit">
              Create
            </Button>
          </form>
        )}
        <Toaster />
      </main>
    </div>
  );
}
