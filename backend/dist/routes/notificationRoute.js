"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const notification_controller_1 = require("../controllers/notification.controller");
const notificationRouter = (0, express_1.Router)();
notificationRouter.use(auth_middleware_1.authenticate);
notificationRouter.post("/send-reminder", notification_controller_1.sendPaymentReminder);
notificationRouter.post("/send-overdue-reminder", notification_controller_1.sendOverdueReminder);
notificationRouter.post("/send-bulk-overdue", notification_controller_1.sendBulkOverdueReminders);
notificationRouter.get("/history", notification_controller_1.getNotificationHistory);
notificationRouter.get("/user", notification_controller_1.getUserNotifications);
notificationRouter.get("/unread-count", notification_controller_1.getUnreadCount);
notificationRouter.post("/mark-all-read", notification_controller_1.markAllAsRead);
notificationRouter.post("/:id/read", notification_controller_1.markAsRead);
notificationRouter.post("/:id/retry", notification_controller_1.retryNotification);
exports.default = notificationRouter;
//# sourceMappingURL=notificationRoute.js.map