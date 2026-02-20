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

  // Verify user exists (this fetches the profile owner from the Database)
  const profileUser = await prisma.user.findUnique({
    where: { username },
  });

  if (!profileUser) {
    notFound();
  }

  // Fetch albums for this user
  const vinyls = await prisma.album.findMany({
    where: {
      userId: profileUser.id,
      type: "collection",
    },
    orderBy: [{ artist: "asc" }, { release_date: "asc" }],
  });

  queryClient.setQueryData(["vinyls", "collection", username], vinyls);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <VinylsPage username={username} name={profileUser.name} />
    </HydrationBoundary>
  );
}
