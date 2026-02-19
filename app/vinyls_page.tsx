"use client";

import { useGetCollection, useGetWishlist } from "@/services/albums/service";

import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { Music } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VinylList } from "@/components/vinyl-list";

function WishlistTab({ searchTerm }: { searchTerm: string }) {
  const wishlist = useGetWishlist(searchTerm);

  return <VinylList query={wishlist} />;
}
function CollectionTab({ searchTerm }: { searchTerm: string }) {
  const collection = useGetCollection(searchTerm);

  return <VinylList query={collection} />;
}

export default function VinylsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [search] = useDebounce(searchTerm, 500);
  const vinyls = useGetCollection();

  return (
    <div>
      <Header>
        <div className="flex gap-3 items-center">
          <div className="p-2 bg-primary/10 rounded-lg h-10">
            <Music className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h1 className="text-lg md:text-2xl font-bold">
              La collection de Charlélise
            </h1>
            {vinyls.data && (
              <p className="text-sm md:text-base text-muted-foreground">
                {vinyls.data.length} vinyle
                {vinyls.data.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </Header>

      <main className="container mx-auto px-4 py-4 md:py-8 flex flex-col gap-8">
        <Tabs defaultValue="collection" className="w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4  md:mb-8">
            <div className="flex-1">
              <TabsList className="">
                <TabsTrigger value="collection">Collection</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              </TabsList>
            </div>

            <Input
              type="text"
              name="search"
              className="max-w-md w-full"
              placeholder="Rechercher un album ou un artiste..."
              defaultValue={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex-1" />
          </div>

          <TabsContent value="collection" className="mt-0">
            <CollectionTab searchTerm={search} />
          </TabsContent>

          <TabsContent value="wishlist" className="mt-0">
            <WishlistTab searchTerm={search} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
