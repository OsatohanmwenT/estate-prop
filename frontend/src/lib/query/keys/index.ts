import { DocumentFilters } from "~/types/document";
import { LeaseQueryParams } from "~/types/lease";

// Query Keys
export const invoiceKeys = {
  all: ["invoices"] as const,
  lists: () => [...invoiceKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) =>
    [...invoiceKeys.lists(), filters] as const,
  details: () => [...invoiceKeys.all, "detail"] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
  byLease: (leaseId: string) => [...invoiceKeys.all, "lease", leaseId] as const,
  overdue: () => [...invoiceKeys.all, "overdue"] as const,
  upcoming: (days?: number) => [...invoiceKeys.all, "upcoming", days] as const,
  statistics: () => [...invoiceKeys.all, "statistics"] as const,
};

export const leaseKeys = {
  all: ["leases"] as const,
  lists: () => [...leaseKeys.all, "list"] as const,
  list: (params: LeaseQueryParams) => [...leaseKeys.lists(), params] as const,
  details: () => [...leaseKeys.all, "detail"] as const,
  detail: (id: string) => [...leaseKeys.details(), id] as const,
  byTenant: (tenantId: string) =>
    [...leaseKeys.all, "tenant", tenantId] as const,
  byUnit: (unitId: string) => [...leaseKeys.all, "unit", unitId] as const,
  statistics: () => [...leaseKeys.all, "statistics"] as const,
  expiring: (days: number) => [...leaseKeys.all, "expiring", days] as const,
};

export const documentKeys = {
  all: ["documents"] as const,
  lists: () => [...documentKeys.all, "list"] as const,
  list: (filters?: DocumentFilters) =>
    [...documentKeys.lists(), filters] as const,
  details: () => [...documentKeys.all, "detail"] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
  folders: () => [...documentKeys.all, "folders"] as const,
  folderList: (propertyId?: string) =>
    [...documentKeys.folders(), propertyId] as const,
};