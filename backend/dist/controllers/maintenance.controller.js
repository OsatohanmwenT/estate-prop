"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markReminderSent = exports.getPendingReminders = exports.addReceipt = exports.getMaintenanceByUnit = exports.getMaintenanceByProperty = exports.getMaintenanceStatistics = exports.getMaintenanceLogs = exports.addComment = exports.deleteMaintenanceRequest = exports.updateMaintenanceRequest = exports.getMaintenanceRequestById = exports.getMaintenanceRequests = exports.createMaintenanceRequest = void 0;
const maintenance_service_1 = require("../services/maintenance.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.createMaintenanceRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
    const request = await maintenance_service_1.maintenanceService.createMaintenanceRequest(data);
    res.status(201).json({
        success: true,
        message: "Maintenance request created successfully",
        data: request,
    });
});
exports.getMaintenanceRequests = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const filters = {
        organizationId,
        limit: parseInt(req.query.limit) || 50,
        offset: parseInt(req.query.offset) || 0,
        status: req.query.status,
        priority: req.query.priority,
        type: req.query.type,
        propertyId: req.query.propertyId,
        unitId: req.query.unitId,
    };
    const requests = await maintenance_service_1.maintenanceService.getMaintenanceRequests(filters);
    res.json({
        success: true,
        count: requests.length,
        data: requests,
    });
});
exports.getMaintenanceRequestById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const request = await maintenance_service_1.maintenanceService.getMaintenanceRequestById(id);
    if (!request) {
        return res.status(404).json({
            success: false,
            message: "Maintenance request not found",
        });
    }
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
});
exports.updateMaintenanceRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const organizationId = req.user?.organizationId;
    if (!organizationId || !userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const updated = await maintenance_service_1.maintenanceService.updateMaintenanceRequest(id, userId, req.body);
    res.json({
        success: true,
        message: "Maintenance request updated successfully",
        data: updated,
    });
});
exports.deleteMaintenanceRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const organizationId = req.user?.organizationId;
    if (!organizationId || !userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    await maintenance_service_1.maintenanceService.deleteMaintenanceRequest(id, userId);
    res.json({
        success: true,
        message: "Maintenance request deleted successfully",
    });
});
exports.addComment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
    await maintenance_service_1.maintenanceService.addComment(id, userId, comment);
    res.json({
        success: true,
        message: "Comment added successfully",
    });
});
exports.getMaintenanceLogs = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const logs = await maintenance_service_1.maintenanceService.getLogsByRequestId(id);
    res.json({
        success: true,
        count: logs.length,
        data: logs,
    });
});
exports.getMaintenanceStatistics = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const stats = await maintenance_service_1.maintenanceService.getStatistics(organizationId);
    res.json({
        success: true,
        data: stats,
    });
});
exports.getMaintenanceByProperty = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { propertyId } = req.params;
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const result = await maintenance_service_1.maintenanceService.getMaintenanceByProperty(propertyId, organizationId);
    res.json({
        success: true,
        data: result,
    });
});
exports.getMaintenanceByUnit = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { unitId } = req.params;
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const result = await maintenance_service_1.maintenanceService.getMaintenanceByUnit(unitId, organizationId);
    res.json({
        success: true,
        data: result,
    });
});
exports.addReceipt = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
    await maintenance_service_1.maintenanceService.addReceipt(id, receiptUrl, userId);
    res.json({
        success: true,
        message: "Receipt added successfully",
    });
});
exports.getPendingReminders = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const reminders = await maintenance_service_1.maintenanceService.getMaintenanceNeedingReminders(organizationId);
    res.json({
        success: true,
        count: reminders.length,
        data: reminders,
    });
});
exports.markReminderSent = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    await maintenance_service_1.maintenanceService.markReminderSent(id);
    res.json({
        success: true,
        message: "Reminder marked as sent",
    });
});
//# sourceMappingURL=maintenance.controller.js.map