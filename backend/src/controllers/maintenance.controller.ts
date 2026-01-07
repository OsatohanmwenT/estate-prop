/**
 * Maintenance Controller
 * API endpoints for maintenance request and log management
 */

import { Request, Response } from "express";
import { maintenanceService } from "../services/maintenance.service";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * @route POST /api/v1/maintenance
 * @desc Create a new maintenance request
 * @access Protected
 */
export const createMaintenanceRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;
    const userId = req.user?.id;

    if (!organizationId || !userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const data = {
      ...req.body,
      organizationId,
      reportedBy: userId,
    };

    const request = await maintenanceService.createMaintenanceRequest(data);

    res.status(201).json({
      success: true,
      message: "Maintenance request created successfully",
      data: request,
    });
  }
);

/**
 * @route GET /api/v1/maintenance
 * @desc Get all maintenance requests
 * @access Protected
 */
export const getMaintenanceRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const filters = {
      organizationId,
      limit: parseInt(req.query.limit as string) || 50,
      offset: parseInt(req.query.offset as string) || 0,
      status: req.query.status as any,
      priority: req.query.priority as any,
      type: req.query.type as any,
      propertyId: req.query.propertyId as string,
      unitId: req.query.unitId as string,
    };

    const requests = await maintenanceService.getMaintenanceRequests(filters);

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  }
);

/**
 * @route GET /api/v1/maintenance/:id
 * @desc Get a single maintenance request with logs
 * @access Protected
 */
export const getMaintenanceRequestById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const request = await maintenanceService.getMaintenanceRequestById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found",
      });
    }

    // Verify organization access
    if (request.organizationId !== organizationId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: request,
    });
  }
);

/**
 * @route PATCH /api/v1/maintenance/:id
 * @desc Update a maintenance request
 * @access Protected
 */
export const updateMaintenanceRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const organizationId = req.user?.organizationId;

    if (!organizationId || !userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const updated = await maintenanceService.updateMaintenanceRequest(
      id,
      userId,
      req.body
    );

    res.json({
      success: true,
      message: "Maintenance request updated successfully",
      data: updated,
    });
  }
);

/**
 * @route DELETE /api/v1/maintenance/:id
 * @desc Delete a maintenance request
 * @access Protected
 */
export const deleteMaintenanceRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const organizationId = req.user?.organizationId;

    if (!organizationId || !userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await maintenanceService.deleteMaintenanceRequest(id, userId);

    res.json({
      success: true,
      message: "Maintenance request deleted successfully",
    });
  }
);

/**
 * @route POST /api/v1/maintenance/:id/comments
 * @desc Add a comment to a maintenance request
 * @access Protected
 */
export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { comment } = req.body;
  const userId = req.user?.id;
  const organizationId = req.user?.organizationId;

  if (!organizationId || !userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!comment) {
    return res.status(400).json({
      success: false,
      message: "Comment is required",
    });
  }

  await maintenanceService.addComment(id, userId, comment);

  res.json({
    success: true,
    message: "Comment added successfully",
  });
});

/**
 * @route GET /api/v1/maintenance/:id/logs
 * @desc Get all logs for a maintenance request
 * @access Protected
 */
export const getMaintenanceLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const logs = await maintenanceService.getLogsByRequestId(id);

    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  }
);

/**
 * @route GET /api/v1/maintenance/statistics
 * @desc Get maintenance statistics
 * @access Protected
 */
export const getMaintenanceStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const stats = await maintenanceService.getStatistics(organizationId);

    res.json({
      success: true,
      data: stats,
    });
  }
);

/**
 * @route GET /api/v1/maintenance/property/:propertyId
 * @desc Get all maintenance for a property with total spent
 * @access Protected
 */
export const getMaintenanceByProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await maintenanceService.getMaintenanceByProperty(
      propertyId,
      organizationId
    );

    res.json({
      success: true,
      data: result,
    });
  }
);

/**
 * @route GET /api/v1/maintenance/unit/:unitId
 * @desc Get all maintenance for a unit with total spent
 * @access Protected
 */
export const getMaintenanceByUnit = asyncHandler(
  async (req: Request, res: Response) => {
    const { unitId } = req.params;
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await maintenanceService.getMaintenanceByUnit(
      unitId,
      organizationId
    );

    res.json({
      success: true,
      data: result,
    });
  }
);

/**
 * @route POST /api/v1/maintenance/:id/receipt
 * @desc Add a receipt to a maintenance request
 * @access Protected
 */
export const addReceipt = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { receiptUrl } = req.body;
  const userId = req.user?.id;
  const organizationId = req.user?.organizationId;

  if (!organizationId || !userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!receiptUrl) {
    return res.status(400).json({
      success: false,
      message: "Receipt URL is required",
    });
  }

  await maintenanceService.addReceipt(id, receiptUrl, userId);

  res.json({
    success: true,
    message: "Receipt added successfully",
  });
});

/**
 * @route GET /api/v1/maintenance/reminders/pending
 * @desc Get maintenance requests needing reminders
 * @access Protected
 */
export const getPendingReminders = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const reminders = await maintenanceService.getMaintenanceNeedingReminders(
      organizationId
    );

    res.json({
      success: true,
      count: reminders.length,
      data: reminders,
    });
  }
);

/**
 * @route POST /api/v1/maintenance/:id/reminder/send
 * @desc Mark reminder as sent
 * @access Protected
 */
export const markReminderSent = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await maintenanceService.markReminderSent(id);

    res.json({
      success: true,
      message: "Reminder marked as sent",
    });
  }
);
