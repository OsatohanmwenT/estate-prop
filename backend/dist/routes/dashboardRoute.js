"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const dashboardRouter = (0, express_1.Router)();
dashboardRouter.use(auth_middleware_1.authenticate);
dashboardRouter.get("/summary", dashboard_controller_1.getDashboardSummary);
dashboardRouter.get("/overdue-rent", dashboard_controller_1.getOverdueRentItems);
dashboardRouter.get("/pending-payments", dashboard_controller_1.getPendingPaymentDetails);
dashboardRouter.get("/upcoming-leases", dashboard_controller_1.getUpcomingLeaseItems);
dashboardRouter.get("/revenue-projections", dashboard_controller_1.getRevenueProjections);
dashboardRouter.get("/overdue-rent/tenants", dashboard_controller_1.getTenantsWithOverdueRent);
dashboardRouter.get("/vacant-units", dashboard_controller_1.getVacantUnits);
dashboardRouter.get("/lease-expirations", dashboard_controller_1.getUpcomingLeaseExpirations);
exports.default = dashboardRouter;
//# sourceMappingURL=dashboardRoute.js.map