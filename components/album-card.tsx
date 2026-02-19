import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardProps } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlbumUI } from "@/types/spotify";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Edit } from "lucide-react";
import { Button } from "./ui/button";

export type AlbumCardProps = CardProps & {
  album: AlbumUI;
  isInModal?: boolean;
  showAdminControls?: boolean;
};

export const AlbumCard = ({
  album,
  className,
  isInModal,
  showAdminControls = false,
  ...rest
}: AlbumCardProps) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <Card
      className={cn(
        "backdrop-blur-sm border shadow-lg pt-3 sm:pt-6 pb-2",
        className,
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
                  },
                )}
              >
                {album.variant}
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <h2
              className={cn(
                "font-semibold text-base md:text-lg leading-tight line-clamp-2",
                {
                  "text-lg line-clamp-none": isInModal,
                },
              )}
            >
              {album.name}
            </h2>
            {isAdmin && showAdminControls && (
              <div
                className="flex gap-2 mt-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="icon"
                  variant="outline"
                  asChild
                  className="h-8 w-8"
                >
                  <Link href={`/edit/${album.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <p
            className={cn(
              "text-sm md:text-base text-muted-foreground line-clamp-1",
              {
                "text-base line-clamp-none": isInModal,
              },
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
