import { IEmailProvider, EmailOptions } from "./interfaces/IEmailProvider";
import { RentReminderData, OverdueNoticeData, InvoiceData, WelcomeEmailData, LeaseExpirationData } from "./templates/emailTemplates";
export declare class EmailService {
    private provider;
    constructor(provider?: IEmailProvider);
    verify(): Promise<boolean>;
    send(options: EmailOptions): Promise<boolean>;
    sendRentReminder(to: string, data: RentReminderData): Promise<boolean>;
    sendOverdueNotice(to: string, data: OverdueNoticeData): Promise<boolean>;
    sendInvoice(to: string, data: InvoiceData): Promise<boolean>;
    sendWelcome(to: string, data: WelcomeEmailData): Promise<boolean>;
    sendLeaseExpiration(to: string, data: LeaseExpirationData): Promise<boolean>;
    sendBulkRentReminders(recipients: Array<{
        email: string;
        data: RentReminderData;
    }>): Promise<import("./interfaces/IEmailProvider").BulkEmailResult>;
    sendBulkOverdueNotices(recipients: Array<{
        email: string;
        data: OverdueNoticeData;
    }>): Promise<import("./interfaces/IEmailProvider").BulkEmailResult>;
}
export declare const emailService: EmailService;
//# sourceMappingURL=emailService.d.ts.map