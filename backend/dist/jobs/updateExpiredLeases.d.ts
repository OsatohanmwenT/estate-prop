export interface UpdateExpiredResult {
    updated: number;
    errors: Array<{
        leaseId: string;
        error: string;
    }>;
}
export declare function updateExpiredLeases(): Promise<UpdateExpiredResult>;
//# sourceMappingURL=updateExpiredLeases.d.ts.map