import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardProps } from "@/components/ui/card";
import { AlbumUI } from "@/types/spotify";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export type AlbumCardProps = CardProps & { album: AlbumUI };
export const AlbumCard = ({ album, className, ...rest }: AlbumCardProps) => {
  return (
    <Card
      className={twMerge(
        "bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200 shadow-lg pt-3 sm:pt-6 pb-2",
        className
      )}
      {...rest}
    >
      <CardContent className="px-3 sm:px-6 flex flex-col gap-3">
        <div className="relative aspect-square  overflow-hidden rounded-sm bg-muted">
          <Image
            src={album.image}
            alt={`Pochette de ${album.name}`}
            fill
            className="object-cover"
            sizes="sm:100vw, md:50vw, lg:33vw, xl:25vw, 20vw"
          />
          {album.variant && (
            <div className="absolute top-2 right-2">
              <Badge
                variant="outline"
                className="text-xs bg-white/70 font-semibold"
              >
                {album.variant}
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h2 className="font-semibold text-lg leading-tight line-clamp-2">
            {album.name}
          </h2>

          <p className="text-md text-muted-foreground">
            {album.artists.map((artist) => artist.name).join(", ")}
          </p>

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
  );
};
