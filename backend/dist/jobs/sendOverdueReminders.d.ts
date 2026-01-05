export interface OverdueRemindersResult {
    reminders: number;
    invoiceIds: string[];
    emailsSent: number;
    emailsFailed: number;
}
export declare function sendOverdueReminders(): Promise<OverdueRemindersResult>;
//# sourceMappingURL=sendOverdueReminders.d.ts.map