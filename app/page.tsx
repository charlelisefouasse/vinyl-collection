import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCollectionQueryOptions } from "@/services/albums/service";
import VinylsPage from "@/app/vinyls_page";

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getCollectionQueryOptions());
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <VinylsPage />
    </HydrationBoundary>
  );
}
