"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOwner = exports.updateOwner = exports.getOwnerById = exports.getAllOwners = exports.createOwner = void 0;
const owner_service_1 = require("../services/owner.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.createOwner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { fullName, email, phone, address } = req.body;
        const user = req.user;
        if (!user?.organizationId) {
            return res.status(400).json({
                success: false,
                message: "Organization ID is required",
            });
        }
        const newOwner = await owner_service_1.ownerService.createOwner({
            fullName,
            email,
            phone,
            address,
            organizationId: user.organizationId,
            managedBy: user.id,
        });
        res.status(201).json({
            success: true,
            message: "Owner created successfully",
            data: newOwner,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create owner",
        });
    }
});
exports.getAllOwners = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { search, managedBy, limit = 5, page = 1 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const [owners, count] = await Promise.all([
            owner_service_1.ownerService.getAllOwners({
                search: search,
                managedBy: managedBy,
                limit: Number(limit),
                offset: offset,
            }),
            owner_service_1.ownerService.getOwnersCount(),
        ]);
        res.status(200).json({
            success: true,
            message: "Owners retrieved successfully",
            data: {
                owners,
            },
            pagination: {
                total: count,
                limit: limit ? parseInt(limit) : 5,
                page: page ? parseInt(page) : 1,
                totalPages: Math.ceil(count / (limit ? parseInt(limit) : 5)),
                nextPage: Number(page) * (limit ? parseInt(limit) : 5) < count
                    ? Number(page) + 1
                    : null,
                prevPage: Number(page) > 1 ? Number(page) - 1 : null,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve owners",
        });
    }
});
exports.getOwnerById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { id } = req.params;
        const { details } = req.query;
        if (details === "true") {
            const ownerWithDetails = await owner_service_1.ownerService.getOwnerWithDetails(id);
            if (!ownerWithDetails) {
                return res.status(404).json({
                    success: false,
                    message: "Owner not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Owner retrieved successfully",
                data: ownerWithDetails,
            });
        }
        const owner = await owner_service_1.ownerService.findOwnerById(id);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "Owner not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Owner retrieved successfully",
            data: owner,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve owner",
        });
    }
});
exports.updateOwner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedOwner = await owner_service_1.ownerService.updateOwner(id, updateData);
        return res.status(200).json({
            success: true,
            message: "Owner updated successfully",
            data: updatedOwner,
        });
    }
    catch (error) {
        if (error.message === "Owner not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update owner",
        });
    }
});
exports.deleteOwner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { id } = req.params;
        await owner_service_1.ownerService.deleteOwner(id);
        return res.status(200).json({
            success: true,
            message: "Owner deleted successfully",
        });
    }
    catch (error) {
        if (error.message === "Owner not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete owner",
        });
    }
});
//# sourceMappingURL=owner.controller.js.map