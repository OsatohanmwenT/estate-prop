import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { maintenanceService } from "~/services/maintenance.service";
import type {
  CreateMaintenanceRequest,
  UpdateMaintenanceRequest,
} from "~/types/maintenance";
import { toast } from "sonner";

export const maintenanceKeys = {
  all: ["maintenance"] as const,
  lists: () => [...maintenanceKeys.all, "list"] as const,
  list: (filters: string) => [...maintenanceKeys.lists(), { filters }] as const,
  details: () => [...maintenanceKeys.all, "detail"] as const,
  detail: (id: string) => [...maintenanceKeys.details(), id] as const,
  stats: () => [...maintenanceKeys.all, "stats"] as const,
};

export function useMaintenanceRequests(params?: {
  limit?: number;
  offset?: number;
  status?: string;
  priority?: string;
  type?: string;
  propertyId?: string;
  unitId?: string;
}) {
  return useQuery({
    queryKey: maintenanceKeys.list(JSON.stringify(params)),
    queryFn: () => maintenanceService.getAllMaintenanceRequests(params),
  });
}

export function useMaintenanceRequest(id: string) {
  return useQuery({
    queryKey: maintenanceKeys.detail(id),
    queryFn: () => maintenanceService.getMaintenanceById(id),
    enabled: !!id,
  });
}

export function useMaintenanceStats() {
  return useQuery({
    queryKey: maintenanceKeys.stats(),
    queryFn: () => maintenanceService.getStatistics(),
  });
}

export function useCreateMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMaintenanceRequest) =>
      maintenanceService.createMaintenance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.stats() });
      toast.success("Maintenance request created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create maintenance request");
      console.error(error);
    },
  });
}

export function useUpdateMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMaintenanceRequest;
    }) => maintenanceService.updateMaintenance(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: maintenanceKeys.detail(data.id),
      });
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.stats() });
      toast.success("Maintenance request updated");
    },
    onError: (error) => {
      toast.error("Failed to update maintenance request");
      console.error(error);
    },
  });
}

export function useDeleteMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => maintenanceService.deleteMaintenance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.stats() });
      toast.success("Maintenance request deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete maintenance request");
      console.error(error);
    },
  });
}

export function useAddMaintenanceComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) =>
      maintenanceService.addComment(id, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: maintenanceKeys.detail(variables.id),
      });
      toast.success("Comment added");
    },
    onError: (error) => {
      toast.error("Failed to add comment");
      console.error(error);
    },
  });
}
