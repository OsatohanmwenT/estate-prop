"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentService = exports.DocumentService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
const document_1 = require("../database/schemas/document");
class DocumentService {
    async createDocument(organizationId, userId, data) {
        const [document] = await database_1.db
            .insert(document_1.documents)
            .values({
            organizationId,
            uploadedBy: userId,
            ...data,
        })
            .returning();
        return document;
    }
    async getAllDocuments(organizationId, filters, limit = 50, offset = 0) {
        const conditions = [(0, drizzle_orm_1.eq)(document_1.documents.organizationId, organizationId)];
        if (filters?.category) {
            conditions.push((0, drizzle_orm_1.eq)(document_1.documents.category, filters.category));
        }
        if (filters?.propertyId) {
            conditions.push((0, drizzle_orm_1.eq)(document_1.documents.propertyId, filters.propertyId));
        }
        if (filters?.ownerId) {
            conditions.push((0, drizzle_orm_1.eq)(document_1.documents.ownerId, filters.ownerId));
        }
        if (filters?.folderId) {
            conditions.push((0, drizzle_orm_1.eq)(document_1.documents.folderId, filters.folderId));
        }
        if (filters?.search) {
            conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(document_1.documents.fileName, `%${filters.search}%`), (0, drizzle_orm_1.ilike)(document_1.documents.description, `%${filters.search}%`)));
        }
        const results = await database_1.db
            .select()
            .from(document_1.documents)
            .where((0, drizzle_orm_1.and)(...conditions))
            .limit(limit)
            .offset(offset)
            .orderBy((0, drizzle_orm_1.sql) `${document_1.documents.uploadedAt} DESC`);
        return results;
    }
    async getDocumentById(documentId, organizationId) {
        const [document] = await database_1.db
            .select()
            .from(document_1.documents)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(document_1.documents.id, documentId), (0, drizzle_orm_1.eq)(document_1.documents.organizationId, organizationId)))
            .limit(1);
        return document || null;
    }
    async updateDocument(documentId, organizationId, data) {
        const [updatedDocument] = await database_1.db
            .update(document_1.documents)
            .set({
            ...data,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(document_1.documents.id, documentId), (0, drizzle_orm_1.eq)(document_1.documents.organizationId, organizationId)))
            .returning();
        return updatedDocument || null;
    }
    async deleteDocument(documentId, organizationId) {
        const [deletedDocument] = await database_1.db
            .delete(document_1.documents)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(document_1.documents.id, documentId), (0, drizzle_orm_1.eq)(document_1.documents.organizationId, organizationId)))
            .returning();
        return deletedDocument || null;
    }
    async getDocumentsCount(organizationId, filters) {
        const conditions = [(0, drizzle_orm_1.eq)(document_1.documents.organizationId, organizationId)];
        if (filters?.category) {
            conditions.push((0, drizzle_orm_1.eq)(document_1.documents.category, filters.category));
        }
        if (filters?.propertyId) {
            conditions.push((0, drizzle_orm_1.eq)(document_1.documents.propertyId, filters.propertyId));
        }
        if (filters?.ownerId) {
            conditions.push((0, drizzle_orm_1.eq)(document_1.documents.ownerId, filters.ownerId));
        }
        if (filters?.folderId) {
            conditions.push((0, drizzle_orm_1.eq)(document_1.documents.folderId, filters.folderId));
        }
        const [result] = await database_1.db
            .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(document_1.documents)
            .where((0, drizzle_orm_1.and)(...conditions));
        return Number(result.count);
    }
    async createFolder(organizationId, userId, data) {
        const [folder] = await database_1.db
            .insert(document_1.folders)
            .values({
            organizationId,
            createdBy: userId,
            ...data,
        })
            .returning();
        return folder;
    }
    async getAllFolders(organizationId, propertyId, parentFolderId) {
        const conditions = [(0, drizzle_orm_1.eq)(document_1.folders.organizationId, organizationId)];
        if (propertyId) {
            conditions.push((0, drizzle_orm_1.eq)(document_1.folders.propertyId, propertyId));
        }
        if (parentFolderId) {
            conditions.push((0, drizzle_orm_1.eq)(document_1.folders.parentFolderId, parentFolderId));
        }
        const results = await database_1.db
            .select()
            .from(document_1.folders)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy(document_1.folders.name);
        return results;
    }
    async getFolderById(folderId, organizationId) {
        const [folder] = await database_1.db
            .select()
            .from(document_1.folders)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(document_1.folders.id, folderId), (0, drizzle_orm_1.eq)(document_1.folders.organizationId, organizationId)))
            .limit(1);
        return folder || null;
    }
    async updateFolder(folderId, organizationId, data) {
        const [updatedFolder] = await database_1.db
            .update(document_1.folders)
            .set(data)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(document_1.folders.id, folderId), (0, drizzle_orm_1.eq)(document_1.folders.organizationId, organizationId)))
            .returning();
        return updatedFolder || null;
    }
    async deleteFolder(folderId, organizationId) {
        const [subfoldersCount] = await database_1.db
            .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(document_1.folders)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(document_1.folders.parentFolderId, folderId), (0, drizzle_orm_1.eq)(document_1.folders.organizationId, organizationId)));
        const [documentsCount] = await database_1.db
            .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(document_1.documents)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(document_1.documents.folderId, folderId), (0, drizzle_orm_1.eq)(document_1.documents.organizationId, organizationId)));
        if (Number(subfoldersCount.count) > 0 || Number(documentsCount.count) > 0) {
            throw new Error("Cannot delete folder with subfolders or documents");
        }
        const [deletedFolder] = await database_1.db
            .delete(document_1.folders)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(document_1.folders.id, folderId), (0, drizzle_orm_1.eq)(document_1.folders.organizationId, organizationId)))
            .returning();
        return deletedFolder || null;
    }
    async getFolderTree(organizationId, propertyId) {
        const conditions = [
            (0, drizzle_orm_1.eq)(document_1.folders.organizationId, organizationId),
            (0, drizzle_orm_1.sql) `${document_1.folders.parentFolderId} IS NULL`,
        ];
        if (propertyId) {
            conditions.push((0, drizzle_orm_1.eq)(document_1.folders.propertyId, propertyId));
        }
        const rootFolders = await database_1.db
            .select()
            .from(document_1.folders)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy(document_1.folders.name);
        const buildTree = async (parentFolder) => {
            const subfolders = await database_1.db
                .select()
                .from(document_1.folders)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(document_1.folders.parentFolderId, parentFolder.id), (0, drizzle_orm_1.eq)(document_1.folders.organizationId, organizationId)))
                .orderBy(document_1.folders.name);
            const folderDocuments = await database_1.db
                .select()
                .from(document_1.documents)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(document_1.documents.folderId, parentFolder.id), (0, drizzle_orm_1.eq)(document_1.documents.organizationId, organizationId)))
                .orderBy(document_1.documents.fileName);
            return {
                ...parentFolder,
                subfolders: await Promise.all(subfolders.map(buildTree)),
                documents: folderDocuments,
            };
        };
        return await Promise.all(rootFolders.map(buildTree));
    }
}
exports.DocumentService = DocumentService;
exports.documentService = new DocumentService();
//# sourceMappingURL=document.service.js.map