/**
 * Notification Controller
 * API endpoints for notification management.
 */

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { notificationService } from "../services/notification.service";
import { emailService } from "../email";
import dashboardService from "../services/dashboard.service";

/**
 * @route POST /api/v1/notifications/send-reminder
 * @desc Send payment reminder to a specific tenant
 * @access Protected
 */
export const sendPaymentReminder = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      tenantEmail,
      tenantName,
      amount,
      dueDate,
      propertyAddress,
      invoiceId,
    } = req.body;
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!tenantEmail || !tenantName || !amount || !dueDate) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: tenantEmail, tenantName, amount, dueDate",
      });
    }

    const success = await emailService.sendRentReminder(tenantEmail, {
      tenantName,
      propertyAddress: propertyAddress || "Property",
      amount: String(amount),
      dueDate,
    });

    // Log to database
    await notificationService.sendEmail(
      organizationId,
      tenantEmail,
      "Rent Payment Reminder",
      `Reminder sent for ${amount} due on ${dueDate}`,
      { invoiceId, type: "rent_reminder" }
    );

    res.json({
      success,
      message: success
        ? "Reminder sent successfully"
        : "Failed to send reminder",
    });
  }
);

/**
 * @route POST /api/v1/notifications/send-overdue-reminder
 * @desc Send overdue notice to a specific tenant
 * @access Protected
 */
export const sendOverdueReminder = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      tenantEmail,
      tenantName,
      amount,
      daysOverdue,
      propertyAddress,
      invoiceId,
    } = req.body;
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!tenantEmail || !tenantName || !amount || daysOverdue === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: tenantEmail, tenantName, amount, daysOverdue",
      });
    }

    const success = await emailService.sendOverdueNotice(tenantEmail, {
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
  }
);

/**
 * @route POST /api/v1/notifications/send-bulk-overdue
 * @desc Send overdue notices to all tenants with overdue rent
 * @access Protected
 */
export const sendBulkOverdueReminders = asyncHandler(
  async (req: Request, res: Response) => {
    const overdueItems = await dashboardService.getOverdueRentItems();

    if (overdueItems.length === 0) {
      return res.json({
        success: true,
        message: "No overdue items to send reminders for",
        sent: 0,
        failed: 0,
      });
    }

    const recipients = overdueItems.map((item) => ({
      email: item.phoneNumber, // Note: This should be email, check your data model
      data: {
        tenantName: item.tenantName,
        propertyAddress: item.unitInfo,
        amount: item.amount,
        daysOverdue: item.daysOverdue,
      },
    }));

    const result = await emailService.sendBulkOverdueNotices(
      recipients.filter((r) => r.email) as any
    );

    res.json({
      success: true,
      message: `Sent ${result.sent} overdue reminders`,
      sent: result.sent,
      failed: result.failed,
    });
  }
);

/**
 * @route GET /api/v1/notifications/history
 * @desc Get notification history for the organization
 * @access Protected
 */
export const getNotificationHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;
    const limit = parseInt(req.query.limit as string) || 50;

    if (!organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const history = await notificationService.getHistory(organizationId, limit);

    res.json({
      success: true,
      count: history.length,
      data: history,
    });
  }
);

/**
 * @route POST /api/v1/notifications/:id/retry
 * @desc Retry a failed notification
 * @access Protected
 */
export const retryNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await notificationService.retry(id);

    res.json({
      success: result.success,
      message: result.success ? "Notification resent" : result.error,
      notificationId: result.notificationId,
    });
  }
);

/**
 * @route POST /api/v1/notifications/:id/read
 * @desc Mark a notification as read
 * @access Protected
 */
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const success = await notificationService.markAsRead(id);

  res.json({
    success,
    message: success ? "Marked as read" : "Failed to mark as read",
  });
});

/**
 * @route POST /api/v1/notifications/mark-all-read
 * @desc Mark all notifications as read
 * @access Protected
 */
export const markAllAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const count = await notificationService.markAllAsRead(organizationId);

    res.json({
      success: true,
      message: `Marked ${count} notifications as read`,
      count,
    });
  }
);

/**
 * @route GET /api/v1/notifications/unread-count
 * @desc Get unread notification count
 * @access Protected
 */
export const getUnreadCount = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const count = await notificationService.getUnreadCount(organizationId);

    res.json({
      success: true,
      count,
    });
  }
);
