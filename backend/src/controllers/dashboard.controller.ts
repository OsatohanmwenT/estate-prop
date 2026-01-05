import { Request, Response } from "express";
import dashboardService from "../services/dashboard.service";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * @route GET /api/v1/dashboard/summary
 * @desc Get dashboard summary with all key metrics
 * @access Protected
 */
export const getDashboardSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const summary = await dashboardService.getDashboardSummary();

    res.status(200).json({
      success: true,
      data: summary,
    });
  }
);

/**
 * @route GET /api/v1/dashboard/overdue-rent/tenants
 * @desc Get list of tenants with overdue rent (legacy endpoint)
 * @access Protected
 */
export const getTenantsWithOverdueRent = asyncHandler(
  async (req: Request, res: Response) => {
    const tenants = await dashboardService.getTenantsWithOverdueRent();

    res.status(200).json({
      success: true,
      count: tenants.length,
      data: tenants,
    });
  }
);

/**
 * @route GET /api/v1/dashboard/overdue-rent
 * @desc Get list of overdue rent items with invoice details
 * @access Protected
 */
export const getOverdueRentItems = asyncHandler(
  async (req: Request, res: Response) => {
    const items = await dashboardService.getOverdueRentItems();

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  }
);

/**
 * @route GET /api/v1/dashboard/vacant-units
 * @desc Get list of all vacant units
 * @access Protected
 */
export const getVacantUnits = asyncHandler(
  async (req: Request, res: Response) => {
    const units = await dashboardService.getVacantUnits();

    res.status(200).json({
      success: true,
      count: units.length,
      data: units,
    });
  }
);

/**
 * @route GET /api/v1/dashboard/pending-payments
 * @desc Get list of pending payments awaiting confirmation
 * @access Protected
 */
export const getPendingPaymentDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const payments = await dashboardService.getPendingPaymentDetails();

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  }
);

/**
 * @route GET /api/v1/dashboard/lease-expirations
 * @desc Get upcoming lease expirations (legacy endpoint - limited to 10)
 * @access Protected
 */
export const getUpcomingLeaseExpirations = asyncHandler(
  async (req: Request, res: Response) => {
    const daysAhead = req.query.days ? parseInt(req.query.days as string) : 60;
    const expirations = await dashboardService.getUpcomingLeaseExpirations(
      daysAhead
    );

    res.status(200).json({
      success: true,
      count: expirations.length,
      data: expirations,
    });
  }
);

/**
 * @route GET /api/v1/dashboard/upcoming-leases
 * @desc Get all upcoming lease expirations with flattened structure
 * @access Protected
 */
export const getUpcomingLeaseItems = asyncHandler(
  async (req: Request, res: Response) => {
    const daysAhead = req.query.days ? parseInt(req.query.days as string) : 60;
    const items = await dashboardService.getUpcomingLeaseItems(daysAhead);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  }
);

/**
 * @route GET /api/v1/dashboard/revenue-projections
 * @desc Get revenue projections for the next 6 months
 * @access Protected
 */
export const getRevenueProjections = asyncHandler(
  async (req: Request, res: Response) => {
    const projections = await dashboardService.getRevenueProjections();

    res.status(200).json({
      success: true,
      data: projections,
    });
  }
);
