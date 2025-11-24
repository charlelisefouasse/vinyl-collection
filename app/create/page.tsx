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
import { ArrowLeft, Music, Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";

export default function Home() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const searchAlbums = useGetAlbums(searchTerm);
  const [album, setAlbum] = useState<AlbumUI>();

  const form = useForm({
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
      form.reset();
    },
  });

  return (
    <>
      <Header>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold">
                {album ? "Ajouter à ma collection" : "Rechercher un vinyle"}
              </h1>
            </div>
          </div>
        </div>
      </Header>
      <main className="container mx-auto px-4 py-8">
        {session.status === "loading" && (
          <div className="max-w-2xl mx-auto text-center">
            Loading or not authenticated...
          </div>
        )}
        {session.status == "authenticated" && (
          <>
            {!album ? (
              <div className="max-w-2xl mx-auto">
                {/* Search Bar */}
                <div className="mb-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 " />
                    <Input
                      name="search"
                      placeholder="Rechercher un album ou un artiste..."
                      onChange={(e) => setSearchTerm(e.target.value)}
                      value={searchTerm}
                      className="pl-10 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {searchTerm && (
                  <div className="space-y-4">
                    {searchAlbums.isLoading && (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Chargement...</p>
                      </div>
                    )}

                    {searchAlbums.isError && (
                      <div className="text-center py-8">
                        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Erreur lors de la recherche d&apos;album
                        </p>
                      </div>
                    )}

                    {!searchAlbums.isLoading &&
                      !!searchTerm &&
                      !searchAlbums.data?.length &&
                      !searchAlbums.isError && (
                        <div className="text-center py-8">
                          <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Aucun résultat trouvé pour &quot;{searchTerm}&quot;
                          </p>
                        </div>
                      )}

                    {!!searchAlbums.data?.length && !searchAlbums.isLoading && (
                      <div className="space-y-3">
                        {searchAlbums.data.map((albumResult) => (
                          <Card
                            key={albumResult.id}
                            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                          >
                            <CardContent>
                              <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                                  <Image
                                    src={albumResult.image}
                                    alt={albumResult.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold">
                                    {albumResult.name}
                                  </h3>
                                  <p className="text-muted-foreground">
                                    {albumResult.artists
                                      .map((artist) => artist.name)
                                      .join(", ")}
                                  </p>
                                  {albumResult.release_date && (
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(
                                        albumResult.release_date
                                      ).getFullYear()}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  onClick={() => setAlbum(albumResult)}
                                  className="gap-2"
                                >
                                  <Plus className="h-4 w-4" />
                                  Ajouter
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Empty State */}
                {!searchTerm && (
                  <div className="text-center py-16">
                    <div className="p-4 bg-muted/50 rounded-full mb-6 w-fit mx-auto">
                      <Search className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">
                      Recherchez votre vinyle
                    </h2>
                    <p className="text-muted-foreground">
                      Tapez le nom d&apos;un album ou d&apos;un artiste pour
                      commencer
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-8">
                {/* Selected Album Preview */}
                <Card className=" bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-md">
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={album.image}
                          alt={album.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold line-clamp-2">
                          {album.name}
                        </h3>
                        <p className="text-muted-foreground">
                          {album.artists
                            .map((artist) => artist.name)
                            .join(", ")}
                        </p>
                        {album.release_date && (
                          <p className="text-sm text-muted-foreground">
                            {new Date(album.release_date).getFullYear()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-md">
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                      }}
                    >
                      <div className="gap-6 flex flex-col">
                        <form.Field name="name">
                          {({ state, handleChange, handleBlur }) => (
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input
                                value={state.value}
                                onChange={(e) => handleChange(e.target.value)}
                                onBlur={handleBlur}
                                placeholder="Album name"
                              />
                            </div>
                          )}
                        </form.Field>
                        <form.Field
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
                        </form.Field>
                        <form.Field
                          name="release_date"
                          // validators={{ onSubmit: ({ value }) => !!value }}
                        >
                          {({ state, handleChange, handleBlur }) => (
                            <div>
                              <Label>Release Date</Label>
                              <Input
                                value={state.value}
                                onChange={(e) => handleChange(e.target.value)}
                                onBlur={handleBlur}
                                placeholder="Release date"
                              />
                            </div>
                          )}
                        </form.Field>
                        <form.Field name="variant">
                          {({ state, handleChange, handleBlur }) => (
                            <div>
                              <Label>Variant</Label>
                              <Input
                                value={state.value}
                                onChange={(e) => handleChange(e.target.value)}
                                onBlur={handleBlur}
                                placeholder="Vinyle variant"
                              />
                            </div>
                          )}
                        </form.Field>
                        <form.Field name="genres">
                          {({ state, handleChange, handleBlur }) => (
                            <div>
                              <Label>Genres</Label>
                              <Input
                                value={state.value}
                                onChange={(e) => handleChange(e.target.value)}
                                onBlur={handleBlur}
                                placeholder="Genres (comma separated)"
                              />
                            </div>
                          )}
                        </form.Field>
                      </div>
                      <div className="flex gap-4 pt-6 place-content-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setAlbum(undefined)}
                        >
                          Annuler
                        </Button>
                        <Button
                          disabled={createAlbum.isPending}
                          type="submit"
                          className="gap-2"
                        >
                          {createAlbum.isPending ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Plus className="h-4 w-4" />
                              Ajouter
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
            <Toaster />
          </>
        )}
      </main>
    </>
  );
}
