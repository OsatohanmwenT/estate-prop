import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leaseService } from "~/services/leaseService";
import {
  CreateLeaseData,
  LeaseQueryParams,
  RenewLeaseData,
  TerminateLeaseData,
  UpdateLeaseData
} from "~/types/lease";
import { leaseKeys } from "./keys";

// Query Keys


// ============ LEASE QUERIES ============

/**
 * Fetch all leases with optional filters
 */
export const useLeases = (params?: LeaseQueryParams) => {
  return useQuery({
    queryKey: leaseKeys.list(params || {}),
    queryFn: () => leaseService.getAllLeases(params),
  });
};

/**
 * Fetch a single lease by ID
 */
export const useLeaseById = (leaseId: string, enabled = true) => {
  return useQuery({
    queryKey: leaseKeys.detail(leaseId),
    queryFn: () => leaseService.getLeaseById(leaseId),
    enabled: enabled && !!leaseId,
  });
};

/**
 * Fetch leases by tenant
 */
export const useLeasesByTenant = (tenantId: string, enabled = true) => {
  return useQuery({
    queryKey: leaseKeys.byTenant(tenantId),
    queryFn: () => leaseService.getLeasesByTenant(tenantId),
    enabled: enabled && !!tenantId,
  });
};

/**
 * Fetch lease by unit
 */
export const useLeaseByUnit = (unitId: string, enabled = true) => {
  return useQuery({
    queryKey: leaseKeys.byUnit(unitId),
    queryFn: () => leaseService.getLeaseByUnit(unitId),
    enabled: enabled && !!unitId,
  });
};

/**
 * Fetch lease statistics
 */
export const useLeaseStatistics = () => {
  return useQuery({
    queryKey: leaseKeys.statistics(),
    queryFn: () => leaseService.getLeaseStatistics(),
  });
};

/**
 * Fetch expiring leases
 */
export const useExpiringLeases = (days: number = 30) => {
  return useQuery({
    queryKey: leaseKeys.expiring(days),
    queryFn: () => leaseService.getExpiringLeases(days),
  });
};

// ============ LEASE MUTATIONS ============

/**
 * Create a new lease
 */
export const useCreateLease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeaseData) => leaseService.createLease(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaseKeys.all });
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

/**
 * Update an existing lease
 */
export const useUpdateLease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeaseData }) =>
      leaseService.updateLease(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: leaseKeys.all });
      queryClient.invalidateQueries({ queryKey: leaseKeys.detail(id) });
    },
  });
};

export const useTerminateLease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TerminateLeaseData }) =>
      leaseService.terminateLease(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: leaseKeys.all });
      queryClient.invalidateQueries({ queryKey: leaseKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
};

export const useRenewLease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RenewLeaseData }) =>
      leaseService.renewLease(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaseKeys.all });
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });
};

export const useUploadLeaseAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      leaseService.uploadAgreement(id, file),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: leaseKeys.detail(id) });
    },
  });
};
