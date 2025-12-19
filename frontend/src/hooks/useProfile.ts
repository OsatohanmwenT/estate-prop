import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "~/services/authService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Hook for fetching user profile data using React Query
 * Note: For authentication state (login, logout, register), use AuthContext instead
 * This hook is only for fetching fresh profile data from the server
 */
export function useProfile() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: profileData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["profile"], null);
      queryClient.invalidateQueries();
      router.push("/login");
      toast.success("Logged out successfully");
    },
    onError: () => {
      // Even if the server call fails, we should clear local state
      queryClient.setQueryData(["profile"], null);
      router.push("/login");
    },
  });

  return {
    user: profileData?.user,
    isAuthenticated: !!profileData?.user,
    isLoading,
    refetchProfile: refetch,
    logout: () => logoutMutation.mutate(),
  };
}
