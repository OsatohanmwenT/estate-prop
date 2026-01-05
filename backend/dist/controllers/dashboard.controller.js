"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevenueProjections = exports.getUpcomingLeaseItems = exports.getUpcomingLeaseExpirations = exports.getPendingPaymentDetails = exports.getVacantUnits = exports.getOverdueRentItems = exports.getTenantsWithOverdueRent = exports.getDashboardSummary = void 0;
const dashboard_service_1 = __importDefault(require("../services/dashboard.service"));
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getDashboardSummary = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const summary = await dashboard_service_1.default.getDashboardSummary();
    res.status(200).json({
        success: true,
        data: summary,
    });
});
exports.getTenantsWithOverdueRent = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const tenants = await dashboard_service_1.default.getTenantsWithOverdueRent();
    res.status(200).json({
        success: true,
        count: tenants.length,
        data: tenants,
    });
});
exports.getOverdueRentItems = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const items = await dashboard_service_1.default.getOverdueRentItems();
    res.status(200).json({
        success: true,
        count: items.length,
        data: items,
    });
});
exports.getVacantUnits = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const units = await dashboard_service_1.default.getVacantUnits();
    res.status(200).json({
        success: true,
        count: units.length,
        data: units,
    });
});
exports.getPendingPaymentDetails = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const payments = await dashboard_service_1.default.getPendingPaymentDetails();
    res.status(200).json({
        success: true,
        count: payments.length,
        data: payments,
    });
});
exports.getUpcomingLeaseExpirations = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const daysAhead = req.query.days ? parseInt(req.query.days) : 60;
    const expirations = await dashboard_service_1.default.getUpcomingLeaseExpirations(daysAhead);
    res.status(200).json({
        success: true,
        count: expirations.length,
        data: expirations,
    });
});
exports.getUpcomingLeaseItems = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const daysAhead = req.query.days ? parseInt(req.query.days) : 60;
    const items = await dashboard_service_1.default.getUpcomingLeaseItems(daysAhead);
    res.status(200).json({
        success: true,
        count: items.length,
        data: items,
    });
});
exports.getRevenueProjections = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const projections = await dashboard_service_1.default.getRevenueProjections();
    res.status(200).json({
        success: true,
        data: projections,
    });
});
//# sourceMappingURL=dashboard.controller.js.map