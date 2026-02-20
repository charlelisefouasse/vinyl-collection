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
