import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  settingsService,
  UpdateOrganizationData,
  InviteMemberData,
} from "~/services/settingsService";

export const settingsKeys = {
  all: ["settings"] as const,
  organization: () => [...settingsKeys.all, "organization"] as const,
  members: (orgId: string) => [...settingsKeys.all, "members", orgId] as const,
};

export function useOrganization() {
  return useQuery({
    queryKey: settingsKeys.organization(),
    queryFn: () => settingsService.getMyOrganization(),
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => settingsService.createOrganization(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.organization() });
      toast.success("Organization created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create organization");
    },
  });
}

export function useMembers(orgId: string | undefined) {
  return useQuery({
    queryKey: settingsKeys.members(orgId || ""),
    queryFn: () => settingsService.getMembers(orgId!),
    enabled: !!orgId,
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orgId,
      data,
    }: {
      orgId: string;
      data: UpdateOrganizationData;
    }) => settingsService.updateOrganization(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.organization() });
      toast.success("Organization updated successfully");
    },
    onError: () => {
      toast.error("Failed to update organization");
    },
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, data }: { orgId: string; data: InviteMemberData }) =>
      settingsService.inviteMember(orgId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: settingsKeys.members(variables.orgId),
      });
      toast.success("Member invited successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to invite member");
    },
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: string }) =>
      settingsService.updateMemberRole(memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      toast.success("Member role updated");
    },
    onError: () => {
      toast.error("Failed to update member role");
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => settingsService.removeMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      toast.success("Member removed");
    },
    onError: () => {
      toast.error("Failed to remove member");
    },
  });
}
