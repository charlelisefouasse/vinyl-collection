"use client";

import { useGetVinyls } from "@/services/albums/service";

import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { Music } from "lucide-react";
import { AlbumCard } from "@/components/album-card";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDebounce } from "use-debounce";
import { AlbumCardSkeleton } from "@/components/album-card-skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function VinylsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [search] = useDebounce(searchTerm, 500);
  const vinyls = useGetVinyls(search);

  return (
    <div>
      <Header>
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <div className="p-2 bg-primary/10 rounded-lg h-10">
              <Music className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Ma Collection</h1>

              {vinyls.data && (
                <p className="text-muted-foreground dark:text-foreground/60">
                  {vinyls.data.length} vinyle
                  {vinyls.data.length > 1 ? "s" : ""}
                  {searchTerm
                    ? ` trouvé${
                        vinyls.data.length > 1 ? "s" : ""
                      } pour "${searchTerm}"`
                    : " dans votre collection"}
                </p>
              )}
            </div>
          </div>
        </div>
      </Header>

      <main className="container mx-auto px-4 py-8 flex flex-col gap-8">
        <Input
          type="text"
          name="search"
          className="max-w-md mx-auto"
          placeholder="Rechercher un album ou un artiste..."
          defaultValue={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {vinyls.isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {Array.from(new Array(5).keys()).map((key) => (
              <AlbumCardSkeleton key={key} />
            ))}
          </div>
        )}

        {vinyls.error && <div>Une erreur est survenue.</div>}

        {vinyls.data && !vinyls.error && (
          <>
            {vinyls.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-muted/50 rounded-full mb-4">
                  <Music className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Aucun vinyle pour le moment
                </h2>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {vinyls.data.map((album) => (
                  <div
                    key={album.id}
                    className={cn({ "opacity-50": vinyls.isFetching })}
                  >
                    <Dialog>
                      <DialogTrigger className="w-full h-full text-left hover:cursor-pointer">
                        <AlbumCard album={album} className="h-full" />
                      </DialogTrigger>
                      <DialogContent
                        className="p-0 rounded-2xl"
                        showCloseButton={false}
                      >
                        <AlbumCard album={album} isInModal />
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
