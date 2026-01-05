import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "~/services/dashboardService";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: () => [...dashboardKeys.all, "summary"] as const,
  overdueRent: () => [...dashboardKeys.all, "overdueRent"] as const,
  pendingPayments: () => [...dashboardKeys.all, "pendingPayments"] as const,
  upcomingLeases: (days: number) =>
    [...dashboardKeys.all, "upcomingLeases", days] as const,
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: () => dashboardService.getSummaryStats(),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useOverdueRentItems() {
  return useQuery({
    queryKey: dashboardKeys.overdueRent(),
    queryFn: () => dashboardService.getOverdueRentItems(),
    staleTime: 30 * 1000,
  });
}

export function usePendingPayments() {
  return useQuery({
    queryKey: dashboardKeys.pendingPayments(),
    queryFn: () => dashboardService.getPendingPayments(),
    staleTime: 30 * 1000,
  });
}

export function useUpcomingLeaseItems(days: number = 60) {
  return useQuery({
    queryKey: dashboardKeys.upcomingLeases(days),
    queryFn: () => dashboardService.getUpcomingLeaseItems(days),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useVacantUnits() {
  return useQuery({
    queryKey: [...dashboardKeys.all, "vacantUnits"] as const,
    queryFn: () => dashboardService.getVacantUnits(),
    staleTime: 60 * 1000,
  });
}

export function useRevenueProjections() {
  return useQuery({
    queryKey: [...dashboardKeys.all, "revenueProjections"] as const,
    queryFn: () => dashboardService.getRevenueProjections(),
    staleTime: 60 * 1000, // 1 minute
  });
}
