import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardProps } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlbumUI } from "@/types/spotify";
import Image from "next/image";

export type AlbumCardProps = CardProps & {
  album: AlbumUI;
  isInModal?: boolean;
};
export const AlbumCard = ({
  album,
  className,
  isInModal,
  ...rest
}: AlbumCardProps) => {
  return (
    <Card
      className={cn(
        "bg-white/70 dark:bg-slate-700/80 backdrop-blur-sm border border-gray-200 dark:border-none shadow-lg pt-3 sm:pt-6 pb-2",
        className
      )}
      {...rest}
    >
      <CardContent className="px-3 sm:px-6 flex flex-col gap-3">
        <div className="relative aspect-square  overflow-hidden rounded-sm bg-muted">
          <Image
            src={album.image}
            alt=""
            fill
            className="object-cover"
            preload
            fetchPriority="high"
            sizes="sm:100vw, md:50vw, lg:33vw, xl:25vw, 20vw"
          />
          {album.variant && (
            <div className="absolute top-2 right-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs bg-background/70 font-semibold text-wrap line-clamp-1 text-ellipsis",
                  {
                    "text-sm": isInModal,
                    "max-w-28 sm:max-w-none": !isInModal,
                  }
                )}
              >
                {album.variant}
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h2
            className={cn(
              "font-semibold text-base md:text-lg leading-tight line-clamp-2",
              {
                "text-lg line-clamp-none": isInModal,
              }
            )}
          >
            {album.name}
          </h2>

          <p
            className={cn(
              "text-sm md:text-base text-muted-foreground dark:text-foreground/60 line-clamp-1",
              {
                "text-base line-clamp-none": isInModal,
              }
            )}
          >
            {album.artist}
          </p>

          {album.genres && (
            <div className="flex flex-wrap gap-1">
              {album.genres.map((genre, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-muted/50"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
