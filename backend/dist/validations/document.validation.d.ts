import { z } from "zod";
export declare const createDocumentSchema: z.ZodObject<{
    folderId: z.ZodOptional<z.ZodUUID>;
    propertyId: z.ZodOptional<z.ZodUUID>;
    ownerId: z.ZodOptional<z.ZodUUID>;
    fileName: z.ZodString;
    fileUrl: z.ZodURL;
    fileType: z.ZodString;
    fileSize: z.ZodOptional<z.ZodNumber>;
    category: z.ZodEnum<{
        maintenance: "maintenance";
        identity: "identity";
        lease: "lease";
        other: "other";
        receipt: "receipt";
        certificate: "certificate";
        contract: "contract";
        insurance: "insurance";
        inspection: "inspection";
    }>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateDocumentSchema: z.ZodObject<{
    folderId: z.ZodOptional<z.ZodUUID>;
    fileName: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<{
        maintenance: "maintenance";
        identity: "identity";
        lease: "lease";
        other: "other";
        receipt: "receipt";
        certificate: "certificate";
        contract: "contract";
        insurance: "insurance";
        inspection: "inspection";
    }>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const documentFiltersSchema: z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
    propertyId: z.ZodOptional<z.ZodUUID>;
    ownerId: z.ZodOptional<z.ZodUUID>;
    folderId: z.ZodOptional<z.ZodUUID>;
    search: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    offset: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
}, z.core.$strip>;
export declare const createFolderSchema: z.ZodObject<{
    name: z.ZodString;
    propertyId: z.ZodOptional<z.ZodUUID>;
    parentFolderId: z.ZodOptional<z.ZodUUID>;
}, z.core.$strip>;
export declare const updateFolderSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    parentFolderId: z.ZodNullable<z.ZodOptional<z.ZodUUID>>;
}, z.core.$strip>;
export declare const folderFiltersSchema: z.ZodObject<{
    propertyId: z.ZodOptional<z.ZodUUID>;
    parentFolderId: z.ZodOptional<z.ZodUUID>;
}, z.core.$strip>;
//# sourceMappingURL=document.validation.d.ts.map