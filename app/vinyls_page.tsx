"use client";

import { useGetCollection, useGetWishlist } from "@/services/albums/service";

import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { Music, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VinylList } from "@/components/vinyl-list";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

function WishlistTab({
  searchTerm,
  username,
  isOwner,
}: {
  searchTerm: string;
  username: string;
  isOwner?: boolean;
}) {
  const wishlist = useGetWishlist(username, searchTerm);

  return (
    <VinylList
      query={wishlist}
      username={username}
      isOwner={isOwner}
      contentWording="wishlist"
    />
  );
}
function CollectionTab({
  searchTerm,
  username,
  isOwner,
}: {
  searchTerm: string;
  username: string;
  isOwner?: boolean;
}) {
  const collection = useGetCollection(username, searchTerm);

  return <VinylList query={collection} username={username} isOwner={isOwner} />;
}

interface VinylsPageProps {
  username?: string;
  name?: string;
}

export default function VinylsPage({ username, name }: VinylsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [search] = useDebounce(searchTerm, 500);
  const vinyls = useGetCollection(username ?? "");
  const session = useSession();
  const user = session?.data?.user as { username?: string } | undefined;

  const isOwner = user?.username === username;
  const displayName = name || username;

  if (!username) {
    return null;
  }

  return (
    <div>
      <Header>
        <div className="flex flex-1 justify-between items-center">
          <div>
            <h1 className="text-lg md:text-2xl font-bold">
              {isOwner ? "Ma collection" : `Collection de ${displayName}`}
            </h1>
            {vinyls.data && (
              <p className="text-sm md:text-base text-muted-foreground">
                {vinyls.data.length} vinyle
                {vinyls.data.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
          {isOwner && (
            <Button asChild size="sm" className="gap-2">
              <Link href={`/${username}/create`}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Ajouter</span>
              </Link>
            </Button>
          )}
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

            <InputGroup className="max-w-2xl">
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                name="search"
                placeholder="Rechercher un album ou un artiste..."
                defaultValue={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            <div className="flex-1" />
          </div>

          <TabsContent value="collection">
            <CollectionTab
              searchTerm={search}
              username={username}
              isOwner={isOwner}
            />
          </TabsContent>

          <TabsContent value="wishlist">
            <WishlistTab
              searchTerm={search}
              username={username}
              isOwner={isOwner}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
