import { AlbumUI, mapAlbumsToUI } from "@/types/spotify";
import { useQuery } from "@tanstack/react-query";

export const useGetAlbums = (searchTerm: string) => {
  return useQuery<Array<AlbumUI>>({
    queryKey: ["albums", searchTerm],
    queryFn: async () =>
      fetch(`/api/spotify?type=album&q=${encodeURIComponent(searchTerm)}`)
        .then((res) => res.json())
        .then(mapAlbumsToUI),
    enabled: !!searchTerm,
  });
};
