import { z } from "zod";

export const documentCategories = [
  "lease",
  "receipt",
  "certificate",
  "identity",
  "contract",
  "insurance",
  "inspection",
  "maintenance",
  "other",
] as const;

export const documentSchema = z.object({
  fileName: z.string().min(1, "File name is required").max(255),
  fileUrl: z.string().url("Invalid file URL"),
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
  folderId: z.string().uuid().optional(),
  propertyId: z.string().uuid().optional(),
  ownerId: z.string().uuid().optional(),
});

export const updateDocumentSchema = z.object({
  fileName: z.string().min(1).max(255).optional(),
  category: z.enum(documentCategories).optional(),
  tags: z.array(z.string()).optional(),
  description: z.string().max(1000).optional().or(z.literal("")),
  folderId: z.string().uuid().optional().or(z.literal("")),
});

export const folderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(255),
  propertyId: z.string().uuid().optional(),
  parentFolderId: z.string().uuid().optional(),
});

export type DocumentFormData = z.infer<typeof documentSchema>;
export type UpdateDocumentFormData = z.infer<typeof updateDocumentSchema>;
export type FolderFormData = z.infer<typeof folderSchema>;
