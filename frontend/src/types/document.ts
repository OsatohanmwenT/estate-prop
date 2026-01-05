export interface CreateDocumentData {
  folderId?: string;
  propertyId?: string;
  ownerId?: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  category: DocumentCategory;
  tags?: string[];
  description?: string;
}

export interface UpdateDocumentData {
  folderId?: string;
  fileName?: string;
  category?: DocumentCategory;
  tags?: string[];
  description?: string;
}

export interface DocumentFilters {
  category?: string;
  propertyId?: string;
  ownerId?: string;
  folderId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateFolderData {
  name: string;
  propertyId?: string;
  parentFolderId?: string;
}

export interface Document {
  id: string;
  organizationId: string;
  folderId?: string;
  propertyId?: string;
  ownerId?: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  description?: string;
  category: DocumentCategory;
  tags?: string[];
  uploadedBy?: string;
  uploadedAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  organizationId: string;
  name: string;
  propertyId?: string;
  parentFolderId?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentCategory =
  | "lease"
  | "receipt"
  | "certificate"
  | "identity"
  | "contract"
  | "insurance"
  | "inspection"
  | "maintenance"
  | "other";
