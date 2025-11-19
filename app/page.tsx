import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getVinylsQueryOptions } from "@/services/albums/service";
import VinylsList from "@/app/vinyls-list";

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getVinylsQueryOptions());
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <VinylsList />
    </HydrationBoundary>
  );
}
