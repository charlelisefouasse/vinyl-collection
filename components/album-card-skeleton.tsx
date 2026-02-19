import { Card, CardContent, CardProps } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type AlbumCardSkeletonProps = CardProps & {};
export const AlbumCardSkeleton = ({
  className,
  ...rest
}: AlbumCardSkeletonProps) => {
  return (
    <Card
      className={cn(
        "backdrop-blur-sm border border-gray-200 dark:border-none shadow-lg py-3 sm:py-6",
        className,
      )}
      {...rest}
    >
      <CardContent className="px-3 sm:px-6 flex flex-col gap-3">
        <div className="relative aspect-square  overflow-hidden rounded-sm bg-muted">
          <Skeleton className="w-[20vw] sm:w-screen md:w-[50vw] lg:w-[33vw] xl:w-[25vw] h-[20vw] sm:h-[100vw] md:h-[50vw] lg:h-[33vw] xl:h-[25vw]" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};
