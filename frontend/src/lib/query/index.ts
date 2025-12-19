import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ownerService,
  propertyService,
  tenantService,
  unitService,
} from "~/services";
import { CreatePropertyData, UpdatePropertyData } from "~/types/property";
import {
  CreateTenantData,
  CreateTenantWithLeaseData,
  UpdateTenantData,
} from "~/types/tenant";

// Queries
export const useOwners = (search?: string) => {
  return useQuery({
    queryKey: ["owners", search],
    queryFn: () => ownerService.getAllOwners({ search, limit: 100 }),
  });
};

export const useOwnerById = (ownerId: string) => {
  return useQuery({
    queryKey: ["owner", ownerId],
    queryFn: () => ownerService.getOwnerById(ownerId),
  });
};

export const useProperties = (params?: {
  search?: string;
  category?: string;
  limit?: number;
}) => {
  const { search, category, limit = 100 } = params || {};

  return useQuery({
    queryKey: ["properties", search, category],
    queryFn: () =>
      propertyService.getAllProperties({
        search,
        category: category && category !== "all" ? category : undefined,
        limit,
      }),
  });
};

export const usePropertyById = (propertyId: string, enabled = true) => {
  return useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => propertyService.getPropertyById(propertyId),
    enabled,
  });
};

export const useUnits = (params?: {
  search?: string;
  type?: string;
  limit?: number;
}) => {
  const { search, type, limit = 100 } = params || {};

  return useQuery({
    queryKey: ["units", search, type, limit],
    queryFn: () =>
      unitService.getAllUnits({
        limit,
      }),
  });
};

export const usePropertyUnits = (propertyId: string, enabled = true) => {
  return useQuery({
    queryKey: ["property-units", propertyId],
    queryFn: () => propertyService.getUnitsByProperty(propertyId),
    enabled: enabled && !!propertyId,
  });
};

// Mutations
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePropertyData) =>
      propertyService.createProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePropertyData }) =>
      propertyService.updateProperty(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", variables.id] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertyService.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

// ============ TENANT QUERIES ============

export const useTenants = (params?: {
  search?: string;
  limit?: number;
  page?: number;
}) => {
  const { search, limit = 100, page = 1 } = params || {};

  return useQuery({
    queryKey: ["tenants", search, limit, page],
    queryFn: () => tenantService.getAllTenants({ search, limit, page }),
  });
};

export const useTenantById = (tenantId: string, enabled = true) => {
  return useQuery({
    queryKey: ["tenant", tenantId],
    queryFn: () => tenantService.getTenantById(tenantId),
    enabled: enabled && !!tenantId,
  });
};

// ============ TENANT MUTATIONS ============

export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTenantData) => tenantService.createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

export const useCreateTenantWithLease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTenantWithLeaseData) =>
      tenantService.createTenantWithLease(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["leases"] });
    },
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantData }) =>
      tenantService.updateTenant(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenant", variables.id] });
    },
  });
};

export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tenantService.deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};
