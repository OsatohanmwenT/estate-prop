"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFolderTree = exports.deleteFolder = exports.updateFolder = exports.getFolderById = exports.getAllFolders = exports.createFolder = exports.deleteDocument = exports.updateDocument = exports.getDocumentById = exports.getAllDocuments = exports.createDocument = void 0;
const document_service_1 = require("../services/document.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const ensureOrgId = (req, res) => {
    const { organizationId } = req.user;
    if (!organizationId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized - No organization ID",
        });
        return null;
    }
    return organizationId;
};
exports.createDocument = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { organizationId, id: userId } = req.user;
    if (!organizationId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized - No organization ID",
        });
        return;
    }
    const data = req.body;
    const document = await document_service_1.documentService.createDocument(organizationId, userId, data);
    res.status(201).json({
        success: true,
        data: document,
        message: "Document uploaded successfully",
    });
});
exports.getAllDocuments = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.user.organizationId;
    const { category, propertyId, folderId, search, limit, offset } = req.query;
    const documents = await document_service_1.documentService.getAllDocuments(organizationId, {
        category: category,
        propertyId: propertyId,
        folderId: folderId,
        search: search,
    }, limit ? Number(limit) : 50, offset ? Number(offset) : 0);
    const total = await document_service_1.documentService.getDocumentsCount(organizationId, {
        category: category,
        propertyId: propertyId,
        folderId: folderId,
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
});
exports.getDocumentById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.user.organizationId;
    const { documentId } = req.params;
    const document = await document_service_1.documentService.getDocumentById(documentId, organizationId);
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
});
exports.updateDocument = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.user.organizationId;
    const { documentId } = req.params;
    const data = req.body;
    const document = await document_service_1.documentService.updateDocument(documentId, organizationId, data);
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
});
exports.deleteDocument = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.user.organizationId;
    const { documentId } = req.params;
    const document = await document_service_1.documentService.deleteDocument(documentId, organizationId);
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
});
exports.createFolder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    const data = req.body;
    const folder = await document_service_1.documentService.createFolder(organizationId, userId, data);
    res.status(201).json({
        success: true,
        data: folder,
        message: "Folder created successfully",
    });
});
exports.getAllFolders = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.user.organizationId;
    const { propertyId, parentFolderId } = req.query;
    const folders = await document_service_1.documentService.getAllFolders(organizationId, propertyId, parentFolderId);
    res.status(200).json({
        success: true,
        data: folders,
    });
});
exports.getFolderById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.user.organizationId;
    const { folderId } = req.params;
    const folder = await document_service_1.documentService.getFolderById(folderId, organizationId);
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
});
exports.updateFolder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.user.organizationId;
    const { folderId } = req.params;
    const data = req.body;
    const folder = await document_service_1.documentService.updateFolder(folderId, organizationId, data);
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
});
exports.deleteFolder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.user.organizationId;
    const { folderId } = req.params;
    try {
        const folder = await document_service_1.documentService.deleteFolder(folderId, organizationId);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Cannot delete folder",
        });
    }
});
exports.getFolderTree = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.user.organizationId;
    const { propertyId } = req.query;
    const tree = await document_service_1.documentService.getFolderTree(organizationId, propertyId);
    res.status(200).json({
        success: true,
        data: tree,
    });
});
//# sourceMappingURL=document.controller.js.map