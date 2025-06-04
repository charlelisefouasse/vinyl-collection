import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Music, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80  dark:bg-slate-900/80 ">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex  gap-3">
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
            <Button asChild className="gap-2">
              <Link href="/create">
                <Plus className="h-4 w-4" />
                Ajouter un vinyle
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
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
              <Button type="submit">
                <Search />
              </Button>
            </div>
          </form>
        </div>
        {sortedAlbums.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <Music className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Aucun vinyle pour le moment
            </h2>
            <Button asChild>
              <Link href="/create">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter mon premier vinyle
              </Link>
            </Button>
          </div>
        ) : (
          // Albums Grid
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {sortedAlbums.map((album) => (
              <Card
                key={album.id}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-md py-3 sm:py-6"
              >
                <CardContent className="px-3 sm:px-6">
                  {/* Album Cover */}
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={album.image}
                      alt={`Pochette de ${album.name}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
                    />
                    {/* Variant Badge - Coin supérieur droit */}
                    {album.variant && (
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant="outline"
                          className="text-xs bg-white/90 backdrop-blur-sm"
                        >
                          {album.variant}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Album Info */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                      {album.name}
                    </h3>

                    {/* Artists */}
                    <p className="text-md text-muted-foreground">
                      {album.artists.map((artist) => artist.name).join(", ")}
                    </p>

                    {/* Genres seulement */}
                    <div className="flex flex-wrap gap-1">
                      {album.genres &&
                        album.genres.map((genre, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-muted/50"
                          >
                            {genre}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
