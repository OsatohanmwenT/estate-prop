export interface EmailAttachment {
    filename: string;
    path?: string;
    content?: string | Buffer;
    contentType?: string;
}
export interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: EmailAttachment[];
    replyTo?: string;
}
export interface BulkEmailResult {
    sent: number;
    failed: number;
    failedEmails: string[];
}
export interface IEmailProvider {
    readonly name: string;
    sendEmail(options: EmailOptions): Promise<boolean>;
    sendBulkEmails(emails: EmailOptions[], batchSize?: number, delayMs?: number): Promise<BulkEmailResult>;
    verify(): Promise<boolean>;
}
//# sourceMappingURL=IEmailProvider.d.ts.map