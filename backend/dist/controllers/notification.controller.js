"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserNotifications = exports.getUnreadCount = exports.markAllAsRead = exports.markAsRead = exports.retryNotification = exports.getNotificationHistory = exports.sendBulkOverdueReminders = exports.sendOverdueReminder = exports.sendPaymentReminder = void 0;
const email_1 = require("../email");
const dashboard_service_1 = __importDefault(require("../services/dashboard.service"));
const notification_service_1 = require("../services/notification.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.sendPaymentReminder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { tenantEmail, tenantName, amount, dueDate, propertyAddress, invoiceId, } = req.body;
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!tenantEmail || !tenantName || !amount || !dueDate) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: tenantEmail, tenantName, amount, dueDate",
        });
    }
    const success = await email_1.emailService.sendRentReminder(tenantEmail, {
        tenantName,
        propertyAddress: propertyAddress || "Property",
        amount: String(amount),
        dueDate,
    });
    await notification_service_1.notificationService.sendEmail(organizationId, tenantEmail, "Rent Payment Reminder", `Reminder sent for ${amount} due on ${dueDate}`, { invoiceId, type: "rent_reminder" });
    res.json({
        success,
        message: success
            ? "Reminder sent successfully"
            : "Failed to send reminder",
    });
});
exports.sendOverdueReminder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { tenantEmail, tenantName, amount, daysOverdue, propertyAddress, invoiceId, } = req.body;
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!tenantEmail || !tenantName || !amount || daysOverdue === undefined) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: tenantEmail, tenantName, amount, daysOverdue",
        });
    }
    const success = await email_1.emailService.sendOverdueNotice(tenantEmail, {
        tenantName,
        propertyAddress: propertyAddress || "Property",
        amount: String(amount),
        daysOverdue,
    });
    res.json({
        success,
        message: success
            ? "Overdue notice sent successfully"
            : "Failed to send notice",
    });
});
exports.sendBulkOverdueReminders = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const overdueItems = await dashboard_service_1.default.getOverdueRentItems();
    if (overdueItems.length === 0) {
        return res.json({
            success: true,
            message: "No overdue items to send reminders for",
            sent: 0,
            failed: 0,
        });
    }
    const recipients = overdueItems.map((item) => ({
        email: item.email,
        data: {
            tenantName: item.tenantName,
            propertyAddress: item.unitInfo,
            amount: item.amount,
            daysOverdue: item.daysOverdue,
        },
    }));
    const result = await email_1.emailService.sendBulkOverdueNotices(recipients.filter((r) => r.email));
    res.json({
        success: true,
        message: `Sent ${result.sent} overdue reminders`,
        sent: result.sent,
        failed: result.failed,
    });
});
exports.getNotificationHistory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.user?.organizationId;
    const limit = parseInt(req.query.limit) || 50;
    if (!organizationId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const history = await notification_service_1.notificationService.getHistory(organizationId, limit);
    res.json({
        success: true,
        count: history.length,
        data: history,
    });
});
exports.retryNotification = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const result = await notification_service_1.notificationService.retry(id);
    res.json({
        success: result.success,
        message: result.success ? "Notification resent" : result.error,
        notificationId: result.notificationId,
    });
});
exports.markAsRead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const success = await notification_service_1.notificationService.markAsRead(id);
    res.json({
        success,
        message: success ? "Marked as read" : "Failed to mark as read",
    });
});
exports.markAllAsRead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const count = await notification_service_1.notificationService.markAllAsRead(organizationId);
    res.json({
        success: true,
        message: `Marked ${count} notifications as read`,
        count,
    });
});
exports.getUnreadCount = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const count = await notification_service_1.notificationService.getUnreadCount(organizationId);
    res.json({
        success: true,
        count,
    });
});
exports.getUserNotifications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit) || 50;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const notifications = await notification_service_1.notificationService.getUserNotifications(userId, limit);
    res.json({
        success: true,
        count: notifications.length,
        data: notifications,
    });
});
//# sourceMappingURL=notification.controller.js.map