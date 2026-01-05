import nodemailer from "nodemailer";
interface EmailInput {
    to: string | string[];
    subject: string;
    html: string;
    text: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: Array<{
        filename: string;
        path?: string;
        content?: string | Buffer;
    }>;
}
export declare const transporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo, import("nodemailer/lib/smtp-transport").Options>;
export declare function sendEmail(emailData: EmailInput, retries?: number): Promise<boolean>;
export declare function sendBulkEmails(emails: EmailInput[], batchSize?: number, delayBetweenBatches?: number): Promise<{
    sent: number;
    failed: number;
    failedEmails: string[];
}>;
declare const _default: {
    sendEmail: typeof sendEmail;
    sendBulkEmails: typeof sendBulkEmails;
    transporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo, import("nodemailer/lib/smtp-transport").Options>;
};
export default _default;
//# sourceMappingURL=sendEmail.d.ts.map