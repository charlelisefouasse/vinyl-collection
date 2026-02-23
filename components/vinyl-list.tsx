import { AlbumUI } from "@/types/spotify";
import Image from "next/image";
import { AlbumCard } from "@/components/album-card";
import { AlbumCardSkeleton } from "@/components/album-card-skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { VisuallyHidden } from "radix-ui";
import { DialogTitle } from "@radix-ui/react-dialog";
import { UseQueryResult } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface VinylListProps {
  query: UseQueryResult<AlbumUI[]>;
  username: string;
  isOwner?: boolean;
  contentWording?: string;
}

export function VinylList({
  query,
  username,
  isOwner,
  contentWording = "collection",
}: VinylListProps) {
  if (query.isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {Array.from(new Array(5).keys()).map((key) => (
          <AlbumCardSkeleton key={key} />
        ))}
      </div>
    );
  }

  if (query.error) {
    return <div>Une erreur est survenue.</div>;
  }

  if (query.data && query.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 pt-16">
        <Image
          src="/assets/empty-states/collection_empty_state.svg"
          alt="Aucun vinyle"
          width={300}
          height={300}
          className="shadow-xl h-42 md:h-56 rounded-md border-2 border-neutral-300 dark:border-none "
        />
        <h2 className="text-xl font-semibold">
          C'est bien silencieux par ici...
        </h2>
        {isOwner ? (
          <>
            <p className="text-muted-foreground max-w-sm">
              Votre {contentWording} est vide. Commencez à ajouter des vinyles
              pour les voir apparaître ici.
            </p>
            <Button size="lg" className="mt-4" asChild>
              <Link href={`/${username}/create`}>
                Ajouter mon premier vinyle !
              </Link>
            </Button>
          </>
        ) : (
          <p className="text-muted-foreground max-w-sm">
            Cette {contentWording} est vide pour le moment !
          </p>
        )}
      </div>
    );
  }

  if (query.data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {query.data.map((album) => (
          <div
            key={album.id}
            className={cn({ "opacity-50": query.isFetching })}
          >
            <Dialog>
              <VisuallyHidden.Root>
                <DialogTitle>{album.name}</DialogTitle>
              </VisuallyHidden.Root>
              <DialogTrigger className="w-full h-full text-left hover:cursor-pointer">
                <AlbumCard album={album} className="h-full" />
              </DialogTrigger>
              <DialogContent
                className="p-0 rounded-2xl"
                showCloseButton={false}
              >
                <AlbumCard
                  album={album}
                  isInModal
                  showAdminControls={isOwner}
                />
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
