type NotificationChannel = "email" | "sms" | "whatsapp" | "push";
export type NotificationType = "payment_received" | "invoice_created" | "invoice_overdue" | "lease_expiring" | "lease_expired" | "tenant_added" | "reminder_sent" | "system";
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
declare class NotificationService {
    send(options: SendNotificationOptions): Promise<NotificationResult>;
    createInApp(options: CreateInAppOptions): Promise<NotificationResult>;
    sendEmail(organizationId: string, to: string, subject: string, html: string, metadata?: Record<string, unknown>): Promise<NotificationResult>;
    sendBulkEmails(organizationId: string, emails: Array<{
        to: string;
        subject: string;
        html: string;
        metadata?: Record<string, unknown>;
    }>): Promise<{
        sent: number;
        failed: number;
        results: NotificationResult[];
    }>;
    getHistory(organizationId: string, limit?: number): Promise<{
        id: string;
        organizationId: string;
        userId: string | null;
        recipientEmail: string | null;
        recipientPhone: string | null;
        subject: string | null;
        message: string;
        channel: "push" | "email" | "sms" | "whatsapp";
        status: "pending" | "sent" | "failed" | "delivered";
        metadata: unknown;
        failureReason: string | null;
        isRead: boolean;
        readAt: Date | null;
        sentAt: Date | null;
        createdAt: Date;
    }[]>;
    retry(notificationId: string): Promise<NotificationResult>;
    markAsRead(notificationId: string): Promise<boolean>;
    markAllAsRead(organizationId: string): Promise<number>;
    getUnreadCount(organizationId: string): Promise<number>;
}
export declare const notificationService: NotificationService;
export {};
//# sourceMappingURL=notification.service.d.ts.map