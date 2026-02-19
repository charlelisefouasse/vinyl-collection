import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import VinylsPage from "@/app/vinyls_page";
import prisma from "@/lib/prisma";

export default async function Home() {
  const queryClient = new QueryClient();

  const vinyls = await prisma.album.findMany({
    orderBy: [{ artist: "asc" }, { release_date: "asc" }],
  });

  queryClient.setQueryData(["vinyls"], vinyls);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <VinylsPage />
    </HydrationBoundary>
  );
}
