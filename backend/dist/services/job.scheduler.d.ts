declare class JobScheduler {
    private generateRecurringInvoices;
    private updateOverdueInvoices;
    private updateExpiredLeases;
    private sendRentDueReminders;
    private sendOverdueReminders;
    initializeJobs(): void;
    manualGenerateInvoices(): Promise<void>;
    manualUpdateOverdue(): Promise<void>;
    manualUpdateExpired(): Promise<void>;
    manualSendReminders(): Promise<void>;
}
declare const _default: JobScheduler;
export default _default;
//# sourceMappingURL=job.scheduler.d.ts.map