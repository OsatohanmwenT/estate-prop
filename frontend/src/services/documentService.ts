import {
  CreateDocumentData,
  CreateFolderData,
  Document,
  DocumentFilters,
  Folder,
  UpdateDocumentData,
} from "~/types/document";
import { BaseService } from "./baseService";

class DocumentService extends BaseService {
  constructor() {
    super("documents");
  }

  /**
   * Get all documents with optional filters
   */
  async getAllDocuments(filters?: DocumentFilters): Promise<Document[]> {
    const queryParams = new URLSearchParams();

    if (filters?.category) queryParams.append("category", filters.category);
    if (filters?.propertyId)
      queryParams.append("propertyId", filters.propertyId);
    if (filters?.ownerId) queryParams.append("ownerId", filters.ownerId);
    if (filters?.folderId) queryParams.append("folderId", filters.folderId);
    if (filters?.search) queryParams.append("search", filters.search);
    if (filters?.limit) queryParams.append("limit", filters.limit.toString());
    if (filters?.offset)
      queryParams.append("offset", filters.offset.toString());

    const url = queryParams.toString() ? `/?${queryParams.toString()}` : "/";
    return this.get<Document[]>(url);
  }

  /**
   * Get a single document by ID
   */
  async getDocumentById(documentId: string): Promise<Document> {
    return this.get<Document>(`/${documentId}`);
  }

  /**
   * Create a new document
   */
  async createDocument(data: CreateDocumentData): Promise<Document> {
    return this.post<Document, CreateDocumentData>("/", data);
  }

  /**
   * Update an existing document
   */
  async updateDocument(
    documentId: string,
    data: UpdateDocumentData
  ): Promise<Document> {
    return this.put<Document, UpdateDocumentData>(`/${documentId}`, data);
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string): Promise<void> {
    return this.delete(`/${documentId}`);
  }

  /**
   * Get all folders with optional property filter
   */
  async getAllFolders(propertyId?: string): Promise<Folder[]> {
    const url = propertyId ? `/folders?propertyId=${propertyId}` : "/folders";
    return this.get<Folder[]>(url);
  }

  /**
   * Create a new folder
   */
  async createFolder(data: CreateFolderData): Promise<Folder> {
    return this.post<Folder, CreateFolderData>("/folders", data);
  }
  /**
   * Get a single folder by ID
   */
  async getFolderById(
    folderId: string,
    organizationId?: string
  ): Promise<Folder> {
    const queryParams = new URLSearchParams();
    if (organizationId) queryParams.append("organizationId", organizationId);

    // Adjust endpoint as needed, assuming /folders/:id or similar
    // The backend route might need verification, usually it's /folders/:id
    return this.get<Folder>(
      `/folders/${folderId}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    );
  }
  /**
   * Delete a folder
   */
  async deleteFolder(folderId: string): Promise<void> {
    return this.delete(`/folders/${folderId}`);
  }
}

export const documentService = new DocumentService();
