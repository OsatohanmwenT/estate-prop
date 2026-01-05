import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  sendPaymentReminder,
  sendOverdueReminder,
  sendBulkOverdueReminders,
  getNotificationHistory,
  retryNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} from "../controllers/notification.controller";

const notificationRouter: Router = Router();

// All notification routes require authentication
notificationRouter.use(authenticate);

// Send individual reminders
notificationRouter.post("/send-reminder", sendPaymentReminder);
notificationRouter.post("/send-overdue-reminder", sendOverdueReminder);

// Bulk operations
notificationRouter.post("/send-bulk-overdue", sendBulkOverdueReminders);

// History and status
notificationRouter.get("/history", getNotificationHistory);
notificationRouter.get("/unread-count", getUnreadCount);

// Mark as read
notificationRouter.post("/mark-all-read", markAllAsRead);
notificationRouter.post("/:id/read", markAsRead);
notificationRouter.post("/:id/retry", retryNotification);

export default notificationRouter;
