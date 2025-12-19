import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { dashboardService } from "~/services/dashboardService";
import type {
  DashboardSummary,
  OverdueRentItem,
  PendingPaymentItem,
  UpcomingLeaseItem,
} from "~/types/dashboard";

/**
 * React Query hook for fetching dashboard summary stats
 *
 * @param enabled - Whether the query should run (default: true)
 * @returns Query result with dashboard summary
 */
export function useDashboardSummary(
  enabled = true
): UseQueryResult<DashboardSummary> {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: () => dashboardService.getSummaryStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5,
    enabled,
  });
}

/**
 * React Query hook for fetching overdue rent items
 *
 * Features:
 * - Auto-refetch every 5 minutes
 * - Server-computed daysOverdue field
 * - Sorted by oldest due date first
 *
 * @param enabled - Whether the query should run (default: true)
 * @returns Query result with overdue rent items
 */
export function useOverdueRentItems(
  enabled = true
): UseQueryResult<OverdueRentItem[]> {
  return useQuery({
    queryKey: ["dashboard", "overdue-rent"],
    queryFn: () => dashboardService.getOverdueRentItems(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5,
    enabled,
  });
}

/**
 * React Query hook for fetching pending payment confirmations
 *
 * Features:
 * - Auto-refetch every 2 minutes (more frequent for payments)
 * - Flattened structure for easy reconciliation
 * - ISO date strings for paymentDate and dueDate
 *
 * @param enabled - Whether the query should run (default: true)
 * @returns Query result with pending payment items
 */
export function usePendingPayments(
  enabled = true
): UseQueryResult<PendingPaymentItem[]> {
  return useQuery({
    queryKey: ["dashboard", "pending-payments"],
    queryFn: () => dashboardService.getPendingPayments(),
    staleTime: 1000 * 60 * 2, // 2 minutes (more frequent for payment confirmations)
    refetchInterval: 1000 * 60 * 2,
    enabled,
  });
}

/**
 * React Query hook for fetching upcoming lease expirations
 *
 * Features:
 * - Auto-refetch every 10 minutes (leases don't change often)
 * - Server-computed daysUntilExpiry field
 * - Configurable days ahead parameter
 * - Sorted by soonest expiry first
 *
 * @param daysAhead - Number of days to look ahead (default: 60)
 * @param enabled - Whether the query should run (default: true)
 * @returns Query result with upcoming lease items
 */
export function useUpcomingLeaseItems(
  daysAhead = 60,
  enabled = true
): UseQueryResult<UpcomingLeaseItem[]> {
  return useQuery({
    queryKey: ["dashboard", "upcoming-leases", daysAhead],
    queryFn: () => dashboardService.getUpcomingLeaseItems(daysAhead),
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchInterval: 1000 * 60 * 10,
    enabled,
  });
}

/**
 * Aggregated hook for fetching all dashboard data
 * Useful when you need all dashboard data in one component
 *
 * @param daysAhead - Days ahead for lease expirations (default: 60)
 * @returns Object with all query results
 */
export function useDashboardData(daysAhead = 60) {
  const summaryQuery = useDashboardSummary();
  const overdueQuery = useOverdueRentItems();
  const pendingQuery = usePendingPayments();
  const leasesQuery = useUpcomingLeaseItems(daysAhead);

  return {
    summary: summaryQuery,
    overdueRent: overdueQuery,
    pendingPayments: pendingQuery,
    upcomingLeases: leasesQuery,
    isLoading:
      summaryQuery.isLoading ||
      overdueQuery.isLoading ||
      pendingQuery.isLoading ||
      leasesQuery.isLoading,
    isError:
      summaryQuery.isError ||
      overdueQuery.isError ||
      pendingQuery.isError ||
      leasesQuery.isError,
    error:
      summaryQuery.error ||
      overdueQuery.error ||
      pendingQuery.error ||
      leasesQuery.error,
  };
}
