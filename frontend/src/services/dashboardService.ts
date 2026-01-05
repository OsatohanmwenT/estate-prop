import {
  DashboardSummary,
  OverdueRentItem,
  PendingPaymentItem,
  UpcomingLeaseItem,
  VacantUnit,
  RevenueProjection,
} from "~/types/dashboard";
import { BaseService } from "./baseService";

class DashboardService extends BaseService {
  constructor() {
    super("dashboard");
  }

  async getSummaryStats(): Promise<DashboardSummary> {
    return this.get<DashboardSummary>("/summary");
  }

  async getOverdueRentItems(): Promise<OverdueRentItem[]> {
    return this.get<OverdueRentItem[]>("/overdue-rent");
  }

  async getPendingPayments(): Promise<PendingPaymentItem[]> {
    return this.get<PendingPaymentItem[]>("/pending-payments");
  }

  async getUpcomingLeaseItems(days: number = 60): Promise<UpcomingLeaseItem[]> {
    return this.get<UpcomingLeaseItem[]>(`/upcoming-leases?days=${days}`);
  }

  async getVacantUnits(): Promise<VacantUnit[]> {
    return this.get<VacantUnit[]>("/vacant-units");
  }

  async getRevenueProjections(): Promise<RevenueProjection[]> {
    return this.get<RevenueProjection[]>("/revenue-projections");
  }
}

export const dashboardService = new DashboardService();
