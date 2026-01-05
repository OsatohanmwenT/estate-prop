import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getDashboardSummary,
  getTenantsWithOverdueRent,
  getVacantUnits,
  getPendingPaymentDetails,
  getUpcomingLeaseExpirations,
  getOverdueRentItems,
  getUpcomingLeaseItems,
  getRevenueProjections,
} from "../controllers/dashboard.controller";

const dashboardRouter: Router = Router();

// All dashboard routes require authentication
dashboardRouter.use(authenticate);

// Main dashboard summary - returns all key metrics
dashboardRouter.get("/summary", getDashboardSummary);

// New aligned endpoints matching frontend interfaces
dashboardRouter.get("/overdue-rent", getOverdueRentItems);
dashboardRouter.get("/pending-payments", getPendingPaymentDetails);
dashboardRouter.get("/upcoming-leases", getUpcomingLeaseItems);
dashboardRouter.get("/revenue-projections", getRevenueProjections);

// Legacy endpoints (for backward compatibility)
dashboardRouter.get("/overdue-rent/tenants", getTenantsWithOverdueRent);
dashboardRouter.get("/vacant-units", getVacantUnits);
dashboardRouter.get("/lease-expirations", getUpcomingLeaseExpirations);

export default dashboardRouter;
