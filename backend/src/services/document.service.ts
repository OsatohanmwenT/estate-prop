import { and, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../database";
import { documents, folders } from "../database/schemas/document";
import {
  CreateDocumentData,
  CreateFolderData,
  DocumentFilters,
  UpdateDocumentData,
  UpdateFolderData,
} from "../types/document";

export class DocumentService {
  async createDocument(
    organizationId: string,
    userId: string,
    data: CreateDocumentData
  ) {
    const [document] = await db
      .insert(documents)
      .values({
        organizationId,
        uploadedBy: userId,
        ...data,
      })
      .returning();

    return document;
  }

  async getAllDocuments(
    organizationId: string,
    filters?: DocumentFilters,
    limit: number = 50,
    offset: number = 0
  ) {
    const conditions = [eq(documents.organizationId, organizationId)];

    if (filters?.category) {
      conditions.push(eq(documents.category, filters.category));
    }

    if (filters?.propertyId) {
      conditions.push(eq(documents.propertyId, filters.propertyId));
    }

    if (filters?.ownerId) {
      conditions.push(eq(documents.ownerId, filters.ownerId));
    }

    if (filters?.folderId) {
      conditions.push(eq(documents.folderId, filters.folderId));
    }

    if (filters?.search) {
      conditions.push(
        or(
          ilike(documents.fileName, `%${filters.search}%`),
          ilike(documents.description, `%${filters.search}%`)
        )!
      );
    }

    const results = await db
      .select()
      .from(documents)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(sql`${documents.uploadedAt} DESC`);

    return results;
  }

  async getDocumentById(documentId: string, organizationId: string) {
    const [document] = await db
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.id, documentId),
          eq(documents.organizationId, organizationId)
        )
      )
      .limit(1);

    return document || null;
  }

  async updateDocument(
    documentId: string,
    organizationId: string,
    data: UpdateDocumentData
  ) {
    const [updatedDocument] = await db
      .update(documents)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(documents.id, documentId),
          eq(documents.organizationId, organizationId)
        )
      )
      .returning();

    return updatedDocument || null;
  }

  async deleteDocument(documentId: string, organizationId: string) {
    const [deletedDocument] = await db
      .delete(documents)
      .where(
        and(
          eq(documents.id, documentId),
          eq(documents.organizationId, organizationId)
        )
      )
      .returning();

    return deletedDocument || null;
  }

  async getDocumentsCount(organizationId: string, filters?: DocumentFilters) {
    const conditions = [eq(documents.organizationId, organizationId)];

    if (filters?.category) {
      conditions.push(eq(documents.category, filters.category));
    }

    if (filters?.propertyId) {
      conditions.push(eq(documents.propertyId, filters.propertyId));
    }

    if (filters?.ownerId) {
      conditions.push(eq(documents.ownerId, filters.ownerId));
    }

    if (filters?.folderId) {
      conditions.push(eq(documents.folderId, filters.folderId));
    }

    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(documents)
      .where(and(...conditions));

    return Number(result.count);
  }

  async createFolder(
    organizationId: string,
    userId: string,
    data: CreateFolderData
  ) {
    const [folder] = await db
      .insert(folders)
      .values({
        organizationId,
        createdBy: userId,
        ...data,
      })
      .returning();

    return folder;
  }

  async getAllFolders(
    organizationId: string,
    propertyId?: string,
    parentFolderId?: string
  ) {
    const conditions = [eq(folders.organizationId, organizationId)];

    if (propertyId) {
      conditions.push(eq(folders.propertyId, propertyId));
    }

    if (parentFolderId) {
      conditions.push(eq(folders.parentFolderId, parentFolderId));
    }

    const results = await db
      .select()
      .from(folders)
      .where(and(...conditions))
      .orderBy(folders.name);

    return results;
  }

  async getFolderById(folderId: string, organizationId: string) {
    const [folder] = await db
      .select()
      .from(folders)
      .where(
        and(
          eq(folders.id, folderId),
          eq(folders.organizationId, organizationId)
        )
      )
      .limit(1);

    return folder || null;
  }

  async updateFolder(
    folderId: string,
    organizationId: string,
    data: UpdateFolderData
  ) {
    const [updatedFolder] = await db
      .update(folders)
      .set(data)
      .where(
        and(
          eq(folders.id, folderId),
          eq(folders.organizationId, organizationId)
        )
      )
      .returning();

    return updatedFolder || null;
  }

  async deleteFolder(folderId: string, organizationId: string) {
    // Check if folder has subfolders or documents
    const [subfoldersCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(folders)
      .where(
        and(
          eq(folders.parentFolderId, folderId),
          eq(folders.organizationId, organizationId)
        )
      );

    const [documentsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(documents)
      .where(
        and(
          eq(documents.folderId, folderId),
          eq(documents.organizationId, organizationId)
        )
      );

    if (Number(subfoldersCount.count) > 0 || Number(documentsCount.count) > 0) {
      throw new Error("Cannot delete folder with subfolders or documents");
    }

    const [deletedFolder] = await db
      .delete(folders)
      .where(
        and(
          eq(folders.id, folderId),
          eq(folders.organizationId, organizationId)
        )
      )
      .returning();

    return deletedFolder || null;
  }

  async getFolderTree(organizationId: string, propertyId?: string) {
    const conditions = [
      eq(folders.organizationId, organizationId),
      sql`${folders.parentFolderId} IS NULL`,
    ];

    if (propertyId) {
      conditions.push(eq(folders.propertyId, propertyId));
    }

    const rootFolders = await db
      .select()
      .from(folders)
      .where(and(...conditions))
      .orderBy(folders.name);

    const buildTree = async (parentFolder: any): Promise<any> => {
      const subfolders = await db
        .select()
        .from(folders)
        .where(
          and(
            eq(folders.parentFolderId, parentFolder.id),
            eq(folders.organizationId, organizationId)
          )
        )
        .orderBy(folders.name);

      const folderDocuments = await db
        .select()
        .from(documents)
        .where(
          and(
            eq(documents.folderId, parentFolder.id),
            eq(documents.organizationId, organizationId)
          )
        )
        .orderBy(documents.fileName);

      return {
        ...parentFolder,
        subfolders: await Promise.all(subfolders.map(buildTree)),
        documents: folderDocuments,
      };
    };

    return await Promise.all(rootFolders.map(buildTree));
  }
}

export const documentService = new DocumentService();
