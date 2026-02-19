import { AlbumUI, mapAlbumsToUI } from "@/types/spotify";
import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

// ...

export const getCollectionQueryOptions = (searchTerm?: string) => ({
  queryKey: searchTerm ? ["vinyls", searchTerm] : ["vinyls"],
  queryFn: async () => {
    const params = searchTerm ? `?s=${encodeURIComponent(searchTerm)}` : "";
    return await fetch(`/api/vinyl${params}`).then((res) => res.json());
  },
  placeholderData: keepPreviousData,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});

export const useGetCollection = (searchTerm?: string) => {
  return useQuery<AlbumUI[]>(getCollectionQueryOptions(searchTerm));
};

export const getWishlistQueryOptions = (searchTerm?: string) => ({
  queryKey: searchTerm ? ["wishlist", searchTerm] : ["wishlist"],
  queryFn: async () => {
    const params = searchTerm ? `?s=${encodeURIComponent(searchTerm)}` : "";
    return await fetch(`/api/wishlist${params}`).then((res) => res.json());
  },
  placeholderData: keepPreviousData,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});

export const useGetWishlist = (searchTerm?: string) => {
  return useQuery<AlbumUI[]>(getWishlistQueryOptions(searchTerm));
};

export const useGetAlbums = (searchTerm: string) => {
  return useQuery<Array<AlbumUI>>({
    queryKey: ["albums", searchTerm],
    queryFn: async () =>
      await fetch(
        `/api/spotify?type=album&q=${encodeURIComponent(searchTerm)}`,
        { credentials: "include" },
      )
        .then((res) => res.json())
        .then(mapAlbumsToUI),
    enabled: !!searchTerm,
  });
};

export const useAddToCollection = (
  options?: UseMutationOptions<void, unknown, AlbumUI>,
) => {
  return useMutation({
    mutationFn: async (data) => {
      await fetch("/api/vinyl", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    },
    ...options,
  });
};

export const useAddToWishlist = (
  options?: UseMutationOptions<void, unknown, AlbumUI>,
) => {
  return useMutation({
    mutationFn: async (data) => {
      await fetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    },
    ...options,
  });
};
