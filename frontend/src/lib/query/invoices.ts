import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoiceService } from "~/services/invoiceService";
import {
  CreateInvoiceData,
  RecordPaymentData,
  UpdateInvoiceData,
} from "~/types/invoice";

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

// ============ INVOICE QUERIES ============

/**
 * Fetch all invoices with optional filters
 */
export const useInvoices = (params?: {
  status?: "pending" | "paid" | "overdue" | "draft" | "partial" | "void";
  leaseId?: string;
  tenantId?: string;
  propertyId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: invoiceKeys.list(params),
    queryFn: () => invoiceService.getAllInvoices(params),
  });
};

/**
 * Fetch a single invoice by ID
 */
export const useInvoiceById = (invoiceId: string, enabled = true) => {
  return useQuery({
    queryKey: invoiceKeys.detail(invoiceId),
    queryFn: () => invoiceService.getInvoiceById(invoiceId),
    enabled: enabled && !!invoiceId,
  });
};

/**
 * Fetch invoices by lease
 */
export const useInvoicesByLease = (leaseId: string, enabled = true) => {
  return useQuery({
    queryKey: invoiceKeys.byLease(leaseId),
    queryFn: () => invoiceService.getInvoicesByLease(leaseId),
    enabled: enabled && !!leaseId,
  });
};

/**
 * Fetch overdue invoices
 */
export const useOverdueInvoices = () => {
  return useQuery({
    queryKey: invoiceKeys.overdue(),
    queryFn: () => invoiceService.getOverdueInvoices(),
  });
};

/**
 * Fetch upcoming invoices
 */
export const useUpcomingInvoices = (daysAhead: number = 7) => {
  return useQuery({
    queryKey: invoiceKeys.upcoming(daysAhead),
    queryFn: () => invoiceService.getUpcomingInvoices(daysAhead),
  });
};

/**
 * Fetch invoice statistics
 */
export const useInvoiceStatistics = () => {
  return useQuery({
    queryKey: invoiceKeys.statistics(),
    queryFn: () => invoiceService.getInvoiceStats(),
  });
};

// ============ INVOICE MUTATIONS ============

/**
 * Create a new invoice
 */
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoiceData) => invoiceService.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
      queryClient.invalidateQueries({ queryKey: ["leases"] });
    },
  });
};

/**
 * Update an existing invoice
 */
export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceData }) =>
      invoiceService.updateInvoice(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(id) });
    },
  });
};

/**
 * Record payment for an invoice
 */
export const useRecordPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RecordPaymentData }) =>
      invoiceService.recordPayment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["leases"] });
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

/**
 * Delete an invoice
 */
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invoiceService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
    },
  });
};

/**
 * Generate recurring invoice for a lease
 */
export const useGenerateRecurringInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leaseId: string) =>
      invoiceService.generateRecurringInvoice(leaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
      queryClient.invalidateQueries({ queryKey: ["leases"] });
    },
  });
};
