/**
 * Notification Service
 * Frontend service for sending notifications via backend API.
 */

import { BaseService } from "./baseService";

export interface SendReminderData {
  tenantEmail: string;
  tenantName: string;
  amount: string | number;
  dueDate: string;
  propertyAddress?: string;
  invoiceId?: string;
}

export interface SendOverdueReminderData {
  tenantEmail: string;
  tenantName: string;
  amount: string | number;
  daysOverdue: number;
  propertyAddress?: string;
  invoiceId?: string;
}

export interface NotificationHistoryItem {
  id: string;
  organizationId: string;
  userId?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  subject?: string;
  message: string;
  channel: "email" | "sms" | "whatsapp" | "push";
  status: "pending" | "sent" | "failed" | "delivered";
  metadata?: Record<string, unknown>;
  failureReason?: string;
  isRead: boolean;
  readAt?: string;
  sentAt?: string;
  createdAt: string;
}

export interface NotificationResult {
  success: boolean;
  message: string;
}

export interface BulkNotificationResult {
  success: boolean;
  message: string;
  sent: number;
  failed: number;
}

class NotificationService extends BaseService {
  constructor() {
    super("notifications");
  }

  /**
   * Send a rent payment reminder to a tenant
   */
  async sendReminder(data: SendReminderData): Promise<NotificationResult> {
    return this.post<NotificationResult, SendReminderData>(
      "/send-reminder",
      data
    );
  }

  /**
   * Send an overdue payment notice to a tenant
   */
  async sendOverdueReminder(
    data: SendOverdueReminderData
  ): Promise<NotificationResult> {
    return this.post<NotificationResult, SendOverdueReminderData>(
      "/send-overdue-reminder",
      data
    );
  }

  /**
   * Send overdue reminders to all tenants with overdue payments
   */
  async sendBulkOverdueReminders(): Promise<BulkNotificationResult> {
    return this.post<BulkNotificationResult, Record<string, never>>(
      "/send-bulk-overdue",
      {}
    );
  }

  /**
   * Get notification history
   */
  async getHistory(limit = 50): Promise<NotificationHistoryItem[]> {
    return this.get<NotificationHistoryItem[]>(`/history?limit=${limit}`);
  }

  /**
   * Retry a failed notification
   */
  async retry(notificationId: string): Promise<NotificationResult> {
    return this.post<NotificationResult, Record<string, never>>(
      `/${notificationId}/retry`,
      {}
    );
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<{ count: number }> {
    return this.get<{ count: number }>("/unread-count");
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ success: boolean; count: number }> {
    return this.post<
      { success: boolean; count: number },
      Record<string, never>
    >("/mark-all-read", {});
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId: string): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }, Record<string, never>>(
      `/${notificationId}/read`,
      {}
    );
  }
}

export const notificationService = new NotificationService();
