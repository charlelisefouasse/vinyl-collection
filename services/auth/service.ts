import { useMutation } from "@tanstack/react-query";
import { signIn, signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useSignInEmail = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: Parameters<typeof signIn.email>[0]) => {
      const { data: result, error } = await signIn.email({
        ...data,
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message);
            data.fetchOptions?.onError?.(ctx);
          },
          onSuccess: (ctx) => {
            router.push("/");
            data.fetchOptions?.onSuccess?.(ctx);
          },
          ...data.fetchOptions,
        },
      });
      if (error) {
        throw error;
      }
      return result;
    },
  });
};

export const useSignInSocial = () => {
  return useMutation({
    mutationFn: async (data: Parameters<typeof signIn.social>[0]) => {
      const { data: result, error } = await signIn.social({
        ...data,
        newUserCallbackURL: "/onboarding",
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message);
            data.fetchOptions?.onError?.(ctx);
          },
          ...data.fetchOptions,
        },
      });
      if (error) {
        throw error;
      }
      return result;
    },
  });
};

export const useSignUpEmail = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: Parameters<typeof signUp.email>[0]) => {
      const { data: result, error } = await signUp.email({
        ...data,
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message);
            data.fetchOptions?.onError?.(ctx);
          },
          onSuccess: (ctx) => {
            router.push("/");
            data.fetchOptions?.onSuccess?.(ctx);
          },
          ...data.fetchOptions,
        },
      });
      if (error) {
        throw error;
      }
      return result;
    },
  });
};
