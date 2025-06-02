import { AlbumUI, mapAlbumsToUI } from "@/types/spotify";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

export const useGetAlbums = (searchTerm: string) => {
  return useQuery<Array<AlbumUI>>({
    queryKey: ["albums", searchTerm],
    queryFn: async () =>
      await fetch(`/api/spotify?type=album&q=${encodeURIComponent(searchTerm)}`)
        .then((res) => res.json())
        .then(mapAlbumsToUI),
    enabled: !!searchTerm,
  });
};

export const useCreateAlbum = (
  options?: UseMutationOptions<void, unknown, AlbumUI>
) => {
  return useMutation({
    mutationFn: async (data) => {
      await fetch("/api/album/create", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    ...options,
  });
};
