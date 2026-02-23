import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import VinylsPage from "@/app/vinyls_page";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const queryClient = new QueryClient();

  const accountUser = await prisma.user.findUnique({
    where: { username },
  });

  if (!accountUser) {
    notFound();
  }

  // Fetch albums for this user
  const vinyls = await prisma.album.findMany({
    where: {
      userId: accountUser.id,
      type: "collection",
    },
    orderBy: [{ artist: "asc" }, { release_date: "asc" }],
  });

  queryClient.setQueryData(["vinyls", "collection", username], vinyls);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <VinylsPage username={username} name={accountUser.name} />
    </HydrationBoundary>
  );
}
