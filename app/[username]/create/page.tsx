"use client";

import Image from "next/image";
import { useState } from "react";
import { useAddAlbum, useGetAlbums } from "@/services/albums/service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlbumUI } from "@/types/spotify";

import Link from "next/link";
import { redirect, useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ArrowLeft, Music, Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useDebounce } from "use-debounce";
import { AlbumForm } from "@/components/album-form";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function Home() {
  const params = useParams();
  const username = params.username as string;
  const router = useRouter();

  const session = useSession();

  // Type safe user check
  const user = session.data?.user as { username?: string } | undefined;

  useEffect(() => {
    if (!session.isPending && !session.data) {
      router.push("/login");
    } else if (
      !session.isPending &&
      session.data &&
      user?.username !== username
    ) {
      toast.error(
        "Vous ne pouvez ajouter des albums qu'à votre propre collection",
      );
      router.push(`/${user?.username || ""}`);
    }
  }, [session.data, session.isPending, username, router, user?.username]);

  const [searchTerm, setSearchTerm] = useState("");
  const [search] = useDebounce(searchTerm, 500);
  const searchAlbums = useGetAlbums(search);
  const [album, setAlbum] = useState<AlbumUI>();

  const addToCollection = useAddAlbum({
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'ajout à la collection",
      );
    },
    onSuccess: () => {
      toast.success("Album ajouté à la collection avec succès !");
      setAlbum(undefined);
    },
  });

  return (
    <>
      <Header hideUserDropdown hideLogo>
        <div className="flex items-center gap-4 ">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            size="icon"
            className="shrink-0"
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-xl md:text-2xl font-bold truncate">
            {album ? "Ajouter à ma collection" : "Rechercher un vinyle"}
          </h1>
        </div>
      </Header>
      <main className="container mx-auto px-4 py-8">
        {session.isPending && (
          <div className="max-w-2xl mx-auto text-center">Chargement...</div>
        )}
        {!session.isPending && session && user?.username === username && (
          <>
            {!album ? (
              <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <InputGroup>
                    <InputGroupAddon>
                      <Search />
                    </InputGroupAddon>
                    <InputGroupInput
                      name="search"
                      placeholder="Rechercher un album ou un artiste..."
                      onChange={(e) => setSearchTerm(e.target.value)}
                      value={searchTerm}
                    />
                  </InputGroup>
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
                                    {albumResult.artist}
                                  </p>
                                  {albumResult.release_date && (
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(
                                        albumResult.release_date,
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
                        <p className="text-muted-foreground">{album.artist}</p>
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
                    <AlbumForm
                      album={album}
                      onSubmit={(payload) =>
                        addToCollection.mutate({
                          ...payload,
                          userId: session.data?.user?.id || "",
                        })
                      }
                      mode="create"
                      onCancel={() => setAlbum(undefined)}
                      isLoading={addToCollection.isPending}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
