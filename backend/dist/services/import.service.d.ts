interface ImportRow {
    propertyOwner: string;
    tenantName: string;
    rent: string | number;
    duration: string;
    phone: string;
}
interface ProcessedResult {
    property: any;
    owner: any;
    tenant?: any;
    lease?: any;
    status: "success" | "error";
    message?: string;
}
export declare const importService: {
    parseFile(file: Express.Multer.File): Promise<ImportRow[]>;
    parseExcel(buffer: Buffer): ImportRow[];
    parseWord(buffer: Buffer): Promise<ImportRow[]>;
    processImport(rows: ImportRow[], organizationId: string, userId: string): Promise<ProcessedResult[]>;
};
export {};
//# sourceMappingURL=import.service.d.ts.map