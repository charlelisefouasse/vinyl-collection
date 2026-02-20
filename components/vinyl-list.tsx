import { AlbumUI } from "@/types/spotify";
import { AlbumCard } from "@/components/album-card";
import { AlbumCardSkeleton } from "@/components/album-card-skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Music } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import { DialogTitle } from "@radix-ui/react-dialog";
import { UseQueryResult } from "@tanstack/react-query";

interface VinylListProps {
  query: UseQueryResult<AlbumUI[]>;
  isOwner?: boolean;
}

export function VinylList({ query, isOwner }: VinylListProps) {
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
      <div className="flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-muted/50 rounded-full mb-4">
          <Music className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">
          Aucun vinyle pour le moment
        </h2>
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
