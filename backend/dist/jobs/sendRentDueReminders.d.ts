export interface RentRemindersResult {
    sevenDayReminders: number;
    oneDayReminders: number;
    invoiceIds: string[];
    emailsSent: number;
    emailsFailed: number;
}
export declare function sendRentDueReminders(): Promise<RentRemindersResult>;
//# sourceMappingURL=sendRentDueReminders.d.ts.map