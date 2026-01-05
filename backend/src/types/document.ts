export interface CreateDocumentData {
  folderId?: string;
  propertyId?: string;
  ownerId?: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  category: string;
  tags?: string[];
  description?: string;
}

export interface UpdateDocumentData {
  folderId?: string;
  fileName?: string;
  category?: string;
  tags?: string[];
  description?: string;
}

export interface CreateFolderData {
  name: string;
  propertyId?: string;
  parentFolderId?: string;
}

export interface UpdateFolderData {
  name?: string;
  parentFolderId?: string;
}

export interface DocumentFilters {
  category?: string;
  propertyId?: string;
  ownerId?: string;
  folderId?: string;
  search?: string;
}
