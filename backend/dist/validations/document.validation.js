"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.folderFiltersSchema = exports.updateFolderSchema = exports.createFolderSchema = exports.documentFiltersSchema = exports.updateDocumentSchema = exports.createDocumentSchema = void 0;
const zod_1 = require("zod");
exports.createDocumentSchema = zod_1.z.object({
    folderId: zod_1.z.uuid().optional(),
    propertyId: zod_1.z.uuid().optional(),
    ownerId: zod_1.z.uuid().optional(),
    fileName: zod_1.z.string().min(1, "File name is required").max(255),
    fileUrl: zod_1.z.url("Invalid file URL"),
    fileType: zod_1.z.string().min(1, "File type is required"),
    fileSize: zod_1.z.number().positive().optional(),
    category: zod_1.z.enum([
        "lease",
        "receipt",
        "certificate",
        "identity",
        "contract",
        "insurance",
        "inspection",
        "maintenance",
        "other",
    ]),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    description: zod_1.z.string().max(1000).optional(),
});
exports.updateDocumentSchema = zod_1.z.object({
    folderId: zod_1.z.uuid().optional(),
    fileName: zod_1.z.string().min(1).max(255).optional(),
    category: zod_1.z
        .enum([
        "lease",
        "receipt",
        "certificate",
        "identity",
        "contract",
        "insurance",
        "inspection",
        "maintenance",
        "other",
    ])
        .optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    description: zod_1.z.string().max(1000).optional().nullable(),
});
exports.documentFiltersSchema = zod_1.z.object({
    category: zod_1.z.string().optional(),
    propertyId: zod_1.z.uuid().optional(),
    ownerId: zod_1.z.uuid().optional(),
    folderId: zod_1.z.uuid().optional(),
    search: zod_1.z.string().optional(),
    limit: zod_1.z.string().transform(Number).optional(),
    offset: zod_1.z.string().transform(Number).optional(),
});
exports.createFolderSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Folder name is required").max(255),
    propertyId: zod_1.z.uuid().optional(),
    parentFolderId: zod_1.z.uuid().optional(),
});
exports.updateFolderSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255).optional(),
    parentFolderId: zod_1.z.uuid().optional().nullable(),
});
exports.folderFiltersSchema = zod_1.z.object({
    propertyId: zod_1.z.uuid().optional(),
    parentFolderId: zod_1.z.uuid().optional(),
});
//# sourceMappingURL=document.validation.js.map