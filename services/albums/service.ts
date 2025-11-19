import { AlbumUI, mapAlbumsToUI } from "@/types/spotify";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";

export const getVinylsQueryOptions = (searchTerm?: string) => ({
  queryKey: ["vinyle", searchTerm],
  queryFn: async () => {
    const params = searchTerm ? `?s=${encodeURIComponent(searchTerm)}` : "";
    return await fetch(`/api/vinyl${params}`).then((res) => res.json());
  },
  placeholderData: keepPreviousData,
});

export const useGetVinyls = (searchTerm?: string) => {
  return useQuery<AlbumUI[]>(getVinylsQueryOptions(searchTerm));
};

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
      await fetch("/api/vinyl/create", {
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
