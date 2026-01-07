export interface UpdateOverdueResult {
    updated: number;
    errors: Array<{
        invoiceId: string;
        error: string;
    }>;
}
export declare function updateOverdueInvoices(): Promise<UpdateOverdueResult>;
//# sourceMappingURL=updateOverdueInvoices.d.ts.map