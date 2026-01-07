import { IEmailProvider, EmailOptions, BulkEmailResult } from "../interfaces/IEmailProvider";
interface NodemailerConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    fromName?: string;
    fromEmail?: string;
}
export declare class NodemailerProvider implements IEmailProvider {
    readonly name = "Nodemailer";
    private transporter;
    private fromName;
    private fromEmail;
    constructor(customConfig?: Partial<NodemailerConfig>);
    verify(): Promise<boolean>;
    sendEmail(options: EmailOptions, retries?: number): Promise<boolean>;
    sendBulkEmails(emails: EmailOptions[], batchSize?: number, delayMs?: number): Promise<BulkEmailResult>;
    private htmlToText;
    private delay;
}
export {};
//# sourceMappingURL=NodemailerProvider.d.ts.map