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
        <div className="relative aspect-square  overflow-hidden rounded-sm ">
          <Skeleton className="w-full h-full" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};
