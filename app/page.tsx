import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getVinylsQueryOptions } from "@/services/albums/service";
import VinylsList from "@/app/vinylsList";

export default async function Home() {
  // 1) Create QueryClient on server
  const queryClient = new QueryClient();

  // 2) Fetch vinyls on the server
  await queryClient.prefetchQuery(getVinylsQueryOptions());

  // 3) Dehydrate and pass to client component
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <VinylsList />
    </HydrationBoundary>
  );
}
