export interface RentReminderData {
    tenantName: string;
    propertyAddress: string;
    amount: string | number;
    dueDate: string;
}
export interface OverdueNoticeData {
    tenantName: string;
    propertyAddress: string;
    amount: string | number;
    daysOverdue: number;
}
export interface InvoiceData {
    tenantName: string;
    invoiceNumber: string;
    amount: number;
    dueDate: string;
    downloadLink?: string;
}
export interface WelcomeEmailData {
    tenantName: string;
    propertyAddress: string;
    leaseStartDate: string;
    landlordName: string;
}
export interface LeaseExpirationData {
    tenantName: string;
    propertyAddress: string;
    expiryDate: string;
    daysUntilExpiry: number;
}
export declare const emailTemplates: {
    rentReminder: (data: RentReminderData) => {
        subject: string;
        html: string;
        text: string;
    };
    overdueNotice: (data: OverdueNoticeData) => {
        subject: string;
        html: string;
        text: string;
    };
    invoiceGenerated: (data: InvoiceData) => {
        subject: string;
        html: string;
        text: string;
    };
    welcomeTenant: (data: WelcomeEmailData) => {
        subject: string;
        html: string;
        text: string;
    };
    leaseExpiration: (data: LeaseExpirationData) => {
        subject: string;
        html: string;
        text: string;
    };
};
//# sourceMappingURL=emailTemplates.d.ts.map