import prisma from "@/lib/prisma";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Plus, Music, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { AlbumCard } from "@/components/album-card";

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const params = await searchParams;
  const searchTerm = params.search || "";

  const albums = await prisma.album.findMany({
    where: searchTerm
      ? {
          OR: [
            {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              artists: {
                some: {
                  name: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        }
      : undefined,
    include: { artists: true },
  });

  // Tri final par le premier artiste (nécessaire car Prisma ne peut pas trier directement par le nom du premier artiste de la relation)
  const sortedAlbums = [...albums].sort((a, b) => {
    const artistA = a.artists[0]?.name || "";
    const artistB = b.artists[0]?.name || "";
    return artistA.localeCompare(artistB);
  });

  return (
    <div>
      <Header>
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <div className="p-2 bg-primary/10 rounded-lg h-10 ">
              <Music className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Ma Collection</h1>
              <p className="text-muted-foreground">
                {sortedAlbums.length} vinyle
                {sortedAlbums.length > 1 ? "s" : ""}
                {searchTerm
                  ? ` trouvé${
                      sortedAlbums.length > 1 ? "s" : ""
                    } pour "${searchTerm}"`
                  : " dans votre collection"}
              </p>
            </div>
          </div>
        </div>
      </Header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <form action="/" method="GET" className="relative max-w-md mx-auto">
            <div className="flex gap-2">
              <Input
                type="text"
                name="search"
                placeholder="Rechercher un album ou un artiste..."
                defaultValue={searchTerm}
                className=" bg-white/80 backdrop-blur-sm"
              />
              <Button type="submit" aria-label="Rechercher">
                <Search />
              </Button>
            </div>
          </form>
        </div>
        {sortedAlbums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <Music className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Aucun vinyle pour le moment
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {sortedAlbums.map((album) => (
              <AlbumCard album={album} key={album.id} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
