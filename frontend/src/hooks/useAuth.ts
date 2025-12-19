import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "~/services/authService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(),
    retry: false,
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
      queryClient.setQueryData(["profile"], null);
      router.push("/login");
    },
  });

  return {
    user: profileData?.user,
    isAuthenticated: !!profileData?.user,
    isLoading,
    logout: () => logoutMutation.mutate(),
  };
}
