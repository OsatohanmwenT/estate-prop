import { Request, Response } from "express";
import { documentService } from "../services/document.service";
import { asyncHandler } from "../utils/asyncHandler";

const ensureOrgId = (req: Request, res: Response): string | null => {
  const { organizationId } = req.user!;
  if (!organizationId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized - No organization ID",
    });
    return null;
  }
  return organizationId;
};

export const createDocument = asyncHandler(
  async (req: Request, res: Response) => {
    const { organizationId, id: userId } = req.user!;

    if (!organizationId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized - No organization ID",
      });
      return;
    }

    const data = req.body;

    const document = await documentService.createDocument(
      organizationId,
      userId,
      data
    );

    res.status(201).json({
      success: true,
      data: document,
      message: "Document uploaded successfully",
    });
  }
);

export const getAllDocuments = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId!;
    const { category, propertyId, folderId, search, limit, offset } = req.query;

    const documents = await documentService.getAllDocuments(
      organizationId,
      {
        category: category as string,
        propertyId: propertyId as string,
        folderId: folderId as string,
        search: search as string,
      },
      limit ? Number(limit) : 50,
      offset ? Number(offset) : 0
    );

    const total = await documentService.getDocumentsCount(organizationId, {
      category: category as string,
      propertyId: propertyId as string,
      folderId: folderId as string,
    });

    res.status(200).json({
      success: true,
      data: documents,
      pagination: {
        total,
        limit: limit ? Number(limit) : 50,
        offset: offset ? Number(offset) : 0,
      },
    });
  }
);

export const getDocumentById = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId!;
    const { documentId } = req.params;

    const document = await documentService.getDocumentById(
      documentId,
      organizationId
    );

    if (!document) {
      res.status(404).json({
        success: false,
        message: "Document not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  }
);

export const updateDocument = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId!;
    const { documentId } = req.params;
    const data = req.body;

    const document = await documentService.updateDocument(
      documentId,
      organizationId,
      data
    );

    if (!document) {
      res.status(404).json({
        success: false,
        message: "Document not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: document,
      message: "Document updated successfully",
    });
  }
);

export const deleteDocument = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId!;
    const { documentId } = req.params;

    const document = await documentService.deleteDocument(
      documentId,
      organizationId
    );

    if (!document) {
      res.status(404).json({
        success: false,
        message: "Document not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  }
);

export const createFolder = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId!;
    const userId = req.user!.id;
    const data = req.body;

    const folder = await documentService.createFolder(
      organizationId,
      userId,
      data
    );

    res.status(201).json({
      success: true,
      data: folder,
      message: "Folder created successfully",
    });
  }
);

export const getAllFolders = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId!;
    const { propertyId, parentFolderId } = req.query;

    const folders = await documentService.getAllFolders(
      organizationId,
      propertyId as string,
      parentFolderId as string
    );

    res.status(200).json({
      success: true,
      data: folders,
    });
  }
);

export const getFolderById = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId!;
    const { folderId } = req.params;

    const folder = await documentService.getFolderById(
      folderId,
      organizationId
    );

    if (!folder) {
      res.status(404).json({
        success: false,
        message: "Folder not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: folder,
    });
  }
);

export const updateFolder = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId!;
    const { folderId } = req.params;
    const data = req.body;

    const folder = await documentService.updateFolder(
      folderId,
      organizationId,
      data
    );

    if (!folder) {
      res.status(404).json({
        success: false,
        message: "Folder not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: folder,
      message: "Folder updated successfully",
    });
  }
);

export const deleteFolder = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId!;
    const { folderId } = req.params;

    try {
      const folder = await documentService.deleteFolder(
        folderId,
        organizationId
      );

      if (!folder) {
        res.status(404).json({
          success: false,
          message: "Folder not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Folder deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Cannot delete folder",
      });
    }
  }
);

export const getFolderTree = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId!;
    const { propertyId } = req.query;

    const tree = await documentService.getFolderTree(
      organizationId,
      propertyId as string
    );

    res.status(200).json({
      success: true,
      data: tree,
    });
  }
);
