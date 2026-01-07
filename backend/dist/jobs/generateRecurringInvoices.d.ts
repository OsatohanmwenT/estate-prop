export interface GenerateInvoicesResult {
    created: number;
    skipped: number;
    errors: Array<{
        leaseId: string;
        error: string;
    }>;
}
export declare function generateRecurringInvoices(): Promise<GenerateInvoicesResult>;
//# sourceMappingURL=generateRecurringInvoices.d.ts.map