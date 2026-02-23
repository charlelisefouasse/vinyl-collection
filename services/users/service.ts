import { useQuery } from "@tanstack/react-query";

export const useGetUsers = (searchTerm?: string) => {
  return useQuery({
    queryKey: ["users", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const res = await fetch(`/api/users?q=${encodeURIComponent(searchTerm)}`);
      return res.json();
    },
    enabled: !!searchTerm,
  });
};

import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async (data: Parameters<typeof authClient.updateUser>[0]) => {
      const { data: updatedUser, error } = await authClient.updateUser(data);
      if (error) {
        throw new Error(error.message || "Erreur lors de la mise à jour");
      }
      return updatedUser;
    },
  });
};
