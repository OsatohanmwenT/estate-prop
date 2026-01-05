import { CreateDocumentData, CreateFolderData, DocumentFilters, UpdateDocumentData, UpdateFolderData } from "../types/document";
export declare class DocumentService {
    createDocument(organizationId: string, userId: string, data: CreateDocumentData): Promise<{
        id: string;
        ownerId: string | null;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        category: string;
        propertyId: string | null;
        folderId: string | null;
        fileName: string;
        fileUrl: string;
        fileType: string;
        fileSize: number | null;
        tags: string[] | null;
        uploadedBy: string | null;
        uploadedAt: Date;
    }>;
    getAllDocuments(organizationId: string, filters?: DocumentFilters, limit?: number, offset?: number): Promise<{
        id: string;
        organizationId: string;
        folderId: string | null;
        propertyId: string | null;
        ownerId: string | null;
        fileName: string;
        fileUrl: string;
        fileType: string;
        fileSize: number | null;
        description: string | null;
        category: string;
        tags: string[] | null;
        uploadedBy: string | null;
        uploadedAt: Date;
        updatedAt: Date;
    }[]>;
    getDocumentById(documentId: string, organizationId: string): Promise<{
        id: string;
        organizationId: string;
        folderId: string | null;
        propertyId: string | null;
        ownerId: string | null;
        fileName: string;
        fileUrl: string;
        fileType: string;
        fileSize: number | null;
        description: string | null;
        category: string;
        tags: string[] | null;
        uploadedBy: string | null;
        uploadedAt: Date;
        updatedAt: Date;
    }>;
    updateDocument(documentId: string, organizationId: string, data: UpdateDocumentData): Promise<{
        id: string;
        organizationId: string;
        folderId: string | null;
        propertyId: string | null;
        ownerId: string | null;
        fileName: string;
        fileUrl: string;
        fileType: string;
        fileSize: number | null;
        description: string | null;
        category: string;
        tags: string[] | null;
        uploadedBy: string | null;
        uploadedAt: Date;
        updatedAt: Date;
    }>;
    deleteDocument(documentId: string, organizationId: string): Promise<{
        id: string;
        ownerId: string | null;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        category: string;
        propertyId: string | null;
        folderId: string | null;
        fileName: string;
        fileUrl: string;
        fileType: string;
        fileSize: number | null;
        tags: string[] | null;
        uploadedBy: string | null;
        uploadedAt: Date;
    }>;
    getDocumentsCount(organizationId: string, filters?: DocumentFilters): Promise<number>;
    createFolder(organizationId: string, userId: string, data: CreateFolderData): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        organizationId: string;
        propertyId: string | null;
        createdBy: string | null;
        parentFolderId: string | null;
    }>;
    getAllFolders(organizationId: string, propertyId?: string, parentFolderId?: string): Promise<{
        id: string;
        organizationId: string;
        name: string;
        propertyId: string | null;
        parentFolderId: string | null;
        createdBy: string | null;
        createdAt: Date;
    }[]>;
    getFolderById(folderId: string, organizationId: string): Promise<{
        id: string;
        organizationId: string;
        name: string;
        propertyId: string | null;
        parentFolderId: string | null;
        createdBy: string | null;
        createdAt: Date;
    }>;
    updateFolder(folderId: string, organizationId: string, data: UpdateFolderData): Promise<{
        id: string;
        organizationId: string;
        name: string;
        propertyId: string | null;
        parentFolderId: string | null;
        createdBy: string | null;
        createdAt: Date;
    }>;
    deleteFolder(folderId: string, organizationId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        organizationId: string;
        propertyId: string | null;
        createdBy: string | null;
        parentFolderId: string | null;
    }>;
    getFolderTree(organizationId: string, propertyId?: string): Promise<any[]>;
}
export declare const documentService: DocumentService;
//# sourceMappingURL=document.service.d.ts.map