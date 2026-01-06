/**
 * Notification Service
 * Handles sending notifications across channels and logging to database.
 * Integrates with EmailService for email notifications.
 */

import { eq, and, sql, desc } from "drizzle-orm";
import { db } from "../database";
import { notifications } from "../database/schemas/notification";
import { emailService } from "../email";
import { logger } from "../utils/logger";
import type { EmailOptions } from "../email";

type NotificationChannel = "email" | "sms" | "whatsapp" | "push";
type NotificationStatus = "pending" | "sent" | "failed" | "delivered";

// Common notification types for in-app notifications
export type NotificationType =
  | "payment_received"
  | "invoice_created"
  | "invoice_overdue"
  | "lease_expiring"
  | "lease_expired"
  | "tenant_added"
  | "reminder_sent"
  | "system";

interface SendNotificationOptions {
  organizationId: string;
  userId?: string;
  channel: NotificationChannel;
  recipientEmail?: string;
  recipientPhone?: string;
  subject: string;
  message: string;
  metadata?: Record<string, unknown>;
}

interface CreateInAppOptions {
  organizationId: string;
  userId?: string;
  type: NotificationType;
  subject: string;
  message: string;
  metadata?: Record<string, unknown>;
}

interface NotificationResult {
  success: boolean;
  notificationId: string;
  error?: string;
}

class NotificationService {
  /**
   * Send a notification and log to database
   */
  async send(options: SendNotificationOptions): Promise<NotificationResult> {
    const {
      organizationId,
      userId,
      channel,
      recipientEmail,
      recipientPhone,
      subject,
      message,
      metadata,
    } = options;

    // Create notification record
    const [notification] = await db
      .insert(notifications)
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
    let error: string | undefined;

    try {
      switch (channel) {
        case "email":
          if (!recipientEmail) {
            throw new Error("recipientEmail required for email channel");
          }
          success = await emailService.send({
            to: recipientEmail,
            subject,
            html: message,
          });
          break;

        case "sms":
        case "whatsapp":
        case "push":
          // TODO: Implement other channels
          logger.warn(`Channel ${channel} not yet implemented`);
          success = false;
          error = `Channel ${channel} not implemented`;
          break;

        default:
          throw new Error(`Unknown channel: ${channel}`);
      }

      // Update notification status
      await db
        .update(notifications)
        .set({
          status: success ? "sent" : "failed",
          sentAt: success ? new Date() : undefined,
          failureReason: success ? undefined : error || "Send failed",
        })
        .where(eq(notifications.id, notification.id));

      return {
        success,
        notificationId: notification.id,
        error,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      await db
        .update(notifications)
        .set({
          status: "failed",
          failureReason: errorMessage,
        })
        .where(eq(notifications.id, notification.id));

      return {
        success: false,
        notificationId: notification.id,
        error: errorMessage,
      };
    }
  }

  /**
   * Create an in-app notification (no email, just shows in notification bell)
   */
  async createInApp(options: CreateInAppOptions): Promise<NotificationResult> {
    const { organizationId, userId, type, subject, message, metadata } =
      options;

    try {
      const [notification] = await db
        .insert(notifications)
        .values({
          organizationId,
          userId,
          channel: "push", // Use push channel for in-app notifications
          subject,
          message,
          metadata: { ...metadata, type },
          status: "delivered", // Already delivered since it's in-app
          sentAt: new Date(),
        })
        .returning();

      logger.info(`🔔 In-app notification created: ${subject}`);

      return {
        success: true,
        notificationId: notification.id,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.error(`❌ Failed to create in-app notification: ${errorMessage}`);
      return {
        success: false,
        notificationId: "",
        error: errorMessage,
      };
    }
  }

  /**
   * Send email notification (convenience method)
   */
  async sendEmail(
    organizationId: string,
    to: string,
    subject: string,
    html: string,
    metadata?: Record<string, unknown>
  ): Promise<NotificationResult> {
    return this.send({
      organizationId,
      channel: "email",
      recipientEmail: to,
      subject,
      message: html,
      metadata,
    });
  }

  /**
   * Send bulk email notifications
   */
  async sendBulkEmails(
    organizationId: string,
    emails: Array<{
      to: string;
      subject: string;
      html: string;
      metadata?: Record<string, unknown>;
    }>
  ): Promise<{ sent: number; failed: number; results: NotificationResult[] }> {
    const results: NotificationResult[] = [];
    let sent = 0;
    let failed = 0;

    for (const email of emails) {
      const result = await this.sendEmail(
        organizationId,
        email.to,
        email.subject,
        email.html,
        email.metadata
      );
      results.push(result);
      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    }

    logger.info(
      `📊 Bulk notification complete: ${sent} sent, ${failed} failed`
    );
    return { sent, failed, results };
  }

  /**
   * Get notification history for an organization
   */
  async getHistory(organizationId: string, limit = 50) {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.organizationId, organizationId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  /**
   * Get notifications for a specific user
   */
  async getUserNotifications(userId: string, limit = 50) {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  /**
   * Retry failed notification
   */
  async retry(notificationId: string): Promise<NotificationResult> {
    const [notification] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, notificationId));

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
      channel: notification.channel as NotificationChannel,
      recipientEmail: notification.recipientEmail || undefined,
      recipientPhone: notification.recipientPhone || undefined,
      subject: notification.subject || "",
      message: notification.message,
      metadata: notification.metadata as Record<string, unknown> | undefined,
    });
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await db
        .update(notifications)
        .set({
          isRead: true,
          readAt: new Date(),
        })
        .where(eq(notifications.id, notificationId));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Mark all notifications as read for an organization
   */
  async markAllAsRead(organizationId: string): Promise<number> {
    const result = await db
      .update(notifications)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(
        and(
          eq(notifications.organizationId, organizationId),
          eq(notifications.isRead, false)
        )
      )
      .returning();

    return result.length;
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(organizationId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(notifications)
      .where(
        and(
          eq(notifications.organizationId, organizationId),
          eq(notifications.isRead, false)
        )
      );

    return result[0]?.count || 0;
  }
}

export const notificationService = new NotificationService();
