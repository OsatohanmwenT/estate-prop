export declare const emailTemplates: {
    rentReminder: (data: {
        tenantName: string;
        propertyAddress: string;
        amount: string;
        dueDate: string;
    }) => {
        subject: string;
        html: string;
        text: string;
    };
    overdueNotice: (data: {
        tenantName: string;
        propertyAddress: string;
        amount: string;
        daysOverdue: number;
    }) => {
        subject: string;
        html: string;
        text: string;
    };
    invoiceGenerated: (data: {
        tenantName: string;
        invoiceNumber: string;
        amount: number;
        dueDate: string;
        downloadLink: string;
    }) => {
        subject: string;
        html: string;
    };
};
//# sourceMappingURL=emailTemplates.d.ts.map