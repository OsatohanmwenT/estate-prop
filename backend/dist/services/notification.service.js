"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
const notification_1 = require("../database/schemas/notification");
const email_1 = require("../email");
const logger_1 = require("../utils/logger");
class NotificationService {
    async send(options) {
        const { organizationId, userId, channel, recipientEmail, recipientPhone, subject, message, metadata, } = options;
        const [notification] = await database_1.db
            .insert(notification_1.notifications)
            .values({
            organizationId,
            userId,
            channel,
            recipientEmail,
            recipientPhone,
            subject,
            message,
            metadata,
            status: "pending",
        })
            .returning();
        let success = false;
        let error;
        try {
            switch (channel) {
                case "email":
                    if (!recipientEmail) {
                        throw new Error("recipientEmail required for email channel");
                    }
                    success = await email_1.emailService.send({
                        to: recipientEmail,
                        subject,
                        html: message,
                    });
                    break;
                case "sms":
                case "whatsapp":
                case "push":
                    logger_1.logger.warn(`Channel ${channel} not yet implemented`);
                    success = false;
                    error = `Channel ${channel} not implemented`;
                    break;
                default:
                    throw new Error(`Unknown channel: ${channel}`);
            }
            await database_1.db
                .update(notification_1.notifications)
                .set({
                status: success ? "sent" : "failed",
                sentAt: success ? new Date() : undefined,
                failureReason: success ? undefined : error || "Send failed",
            })
                .where((0, drizzle_orm_1.eq)(notification_1.notifications.id, notification.id));
            return {
                success,
                notificationId: notification.id,
                error,
            };
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            await database_1.db
                .update(notification_1.notifications)
                .set({
                status: "failed",
                failureReason: errorMessage,
            })
                .where((0, drizzle_orm_1.eq)(notification_1.notifications.id, notification.id));
            return {
                success: false,
                notificationId: notification.id,
                error: errorMessage,
            };
        }
    }
    async createInApp(options) {
        const { organizationId, userId, type, subject, message, metadata } = options;
        try {
            const [notification] = await database_1.db
                .insert(notification_1.notifications)
                .values({
                organizationId,
                userId,
                channel: "push",
                subject,
                message,
                metadata: { ...metadata, type },
                status: "delivered",
                sentAt: new Date(),
            })
                .returning();
            logger_1.logger.info(`🔔 In-app notification created: ${subject}`);
            return {
                success: true,
                notificationId: notification.id,
            };
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            logger_1.logger.error(`❌ Failed to create in-app notification: ${errorMessage}`);
            return {
                success: false,
                notificationId: "",
                error: errorMessage,
            };
        }
    }
    async sendEmail(organizationId, to, subject, html, metadata) {
        return this.send({
            organizationId,
            channel: "email",
            recipientEmail: to,
            subject,
            message: html,
            metadata,
        });
    }
    async sendBulkEmails(organizationId, emails) {
        const results = [];
        let sent = 0;
        let failed = 0;
        for (const email of emails) {
            const result = await this.sendEmail(organizationId, email.to, email.subject, email.html, email.metadata);
            results.push(result);
            if (result.success) {
                sent++;
            }
            else {
                failed++;
            }
        }
        logger_1.logger.info(`📊 Bulk notification complete: ${sent} sent, ${failed} failed`);
        return { sent, failed, results };
    }
    async getHistory(organizationId, limit = 50) {
        return database_1.db
            .select()
            .from(notification_1.notifications)
            .where((0, drizzle_orm_1.eq)(notification_1.notifications.organizationId, organizationId))
            .orderBy(notification_1.notifications.createdAt)
            .limit(limit);
    }
    async retry(notificationId) {
        const [notification] = await database_1.db
            .select()
            .from(notification_1.notifications)
            .where((0, drizzle_orm_1.eq)(notification_1.notifications.id, notificationId));
        if (!notification) {
            return {
                success: false,
                notificationId,
                error: "Notification not found",
            };
        }
        if (notification.status !== "failed") {
            return {
                success: false,
                notificationId,
                error: "Only failed notifications can be retried",
            };
        }
        return this.send({
            organizationId: notification.organizationId,
            userId: notification.userId || undefined,
            channel: notification.channel,
            recipientEmail: notification.recipientEmail || undefined,
            recipientPhone: notification.recipientPhone || undefined,
            subject: notification.subject || "",
            message: notification.message,
            metadata: notification.metadata,
        });
    }
    async markAsRead(notificationId) {
        try {
            await database_1.db
                .update(notification_1.notifications)
                .set({
                isRead: true,
                readAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(notification_1.notifications.id, notificationId));
            return true;
        }
        catch {
            return false;
        }
    }
    async markAllAsRead(organizationId) {
        const result = await database_1.db
            .update(notification_1.notifications)
            .set({
            isRead: true,
            readAt: new Date(),
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(notification_1.notifications.organizationId, organizationId), (0, drizzle_orm_1.eq)(notification_1.notifications.isRead, false)))
            .returning();
        return result.length;
    }
    async getUnreadCount(organizationId) {
        const result = await database_1.db
            .select({ count: (0, drizzle_orm_1.sql) `count(*)::int` })
            .from(notification_1.notifications)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(notification_1.notifications.organizationId, organizationId), (0, drizzle_orm_1.eq)(notification_1.notifications.isRead, false)));
        return result[0]?.count || 0;
    }
}
exports.notificationService = new NotificationService();
//# sourceMappingURL=notification.service.js.map