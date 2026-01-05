import { z } from "zod";

// Document Validation Schemas
export const createDocumentSchema = z.object({
  folderId: z.uuid().optional(),
  propertyId: z.uuid().optional(),
  ownerId: z.uuid().optional(),
  fileName: z.string().min(1, "File name is required").max(255),
  fileUrl: z.url("Invalid file URL"),
  fileType: z.string().min(1, "File type is required"),
  fileSize: z.number().positive().optional(),
  category: z.enum([
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

  tags: z.array(z.string()).optional(),
  description: z.string().max(1000).optional(),
});

export const updateDocumentSchema = z.object({
  folderId: z.uuid().optional(),
  fileName: z.string().min(1).max(255).optional(),
  category: z
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

  tags: z.array(z.string()).optional(),
  description: z.string().max(1000).optional().nullable(),
});

export const documentFiltersSchema = z.object({
  category: z.string().optional(),
  propertyId: z.uuid().optional(),
  ownerId: z.uuid().optional(),
  folderId: z.uuid().optional(),
  search: z.string().optional(),

  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});

// Folder Validation Schemas
export const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(255),
  propertyId: z.uuid().optional(),
  parentFolderId: z.uuid().optional(),
});

export const updateFolderSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  parentFolderId: z.uuid().optional().nullable(),
});

export const folderFiltersSchema = z.object({
  propertyId: z.uuid().optional(),
  parentFolderId: z.uuid().optional(),
});
