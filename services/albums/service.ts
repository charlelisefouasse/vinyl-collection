import { AlbumUI, mapAlbumsToUI } from "@/types/spotify";
import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// ...

// Fetches albums from local database
export const getVinylsQueryOptions = (
  searchTerm?: string,
  type: string = "collection",
) => ({
  queryKey: searchTerm ? ["vinyls", type, searchTerm] : ["vinyls", type],
  queryFn: async () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("s", searchTerm);
    params.append("type", type);
    return await fetch(`/api/vinyl?${params.toString()}`).then((res) =>
      res.json(),
    );
  },
  placeholderData: keepPreviousData,
  refetchOnWindowFocus: false,
});

export const useGetCollection = (searchTerm?: string) => {
  return useQuery<AlbumUI[]>(getVinylsQueryOptions(searchTerm, "collection"));
};

export const useGetWishlist = (searchTerm?: string) => {
  return useQuery<AlbumUI[]>(getVinylsQueryOptions(searchTerm, "wishlist"));
};

export const useGetAlbum = (id: string) =>
  useQuery<AlbumUI>({
    queryKey: ["vinyl", id],
    queryFn: async () => {
      return await fetch(`/api/vinyl/${id}`).then((res) => res.json());
    },
  });

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

export const useAddAlbum = (
  options?: UseMutationOptions<void, unknown, AlbumUI>,
) => {
  const queryClient = useQueryClient();
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
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["vinyls"] });
      console.log("cc");
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useDeleteAlbum = (
  options?: UseMutationOptions<void, unknown, string>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/vinyl/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    },
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["vinyls"] });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useUpdateAlbum = (
  options?: UseMutationOptions<void, unknown, AlbumUI>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      await fetch(`/api/vinyl/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    },
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["vinyls"] });
      queryClient.invalidateQueries({ queryKey: ["vinyl"] });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
