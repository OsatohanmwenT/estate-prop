"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.getPropertyById = exports.createProperty = exports.getAllProperties = void 0;
const property_service_1 = require("../services/property.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getAllProperties = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { limit = 10, page = 1, search, city, state, category, ownerId, } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const user = req.user;
        const organizationId = user?.organizationId;
        if (!organizationId) {
            return res.status(403).json({
                success: false,
                message: "Organization ID required",
            });
        }
        const [allProperties, count] = await Promise.all([
            property_service_1.propertyService.getAllProperties({
                limit: Number(limit),
                offset: Number(offset),
                search,
                city,
                state,
                category,
                ownerId,
                organizationId,
            }),
            property_service_1.propertyService.getPropertiesCount({
                ownerId,
                state,
                city,
                category,
                organizationId,
            }),
        ]);
        res.status(200).json({
            success: true,
            message: "Properties retrieved successfully",
            data: allProperties,
            pagination: {
                total: count,
                limit: Number(limit),
                page: Number(page),
                totalPages: Math.ceil(count / Number(limit)),
                nextPage: Number(page) * Number(limit) < count ? Number(page) + 1 : null,
                prevPage: Number(page) > 1 ? Number(page) - 1 : null,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.createProperty = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const propertyData = req.body;
        const newProperty = await property_service_1.propertyService.createProperty(propertyData);
        res.status(201).json({
            success: true,
            data: newProperty,
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors,
            });
        }
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.getPropertyById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { id } = req.params;
        const propertyId = id;
        if (!propertyId) {
            return res.status(400).json({
                success: false,
                message: "Invalid property ID",
            });
        }
        const property = await property_service_1.propertyService.getPropertyById(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Property retrieved successfully",
            data: property,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve property",
        });
    }
});
exports.updateProperty = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { id } = req.params;
        const propertyId = id;
        const updateData = req.body;
        if (!propertyId) {
            return res.status(400).json({
                success: false,
                message: "Invalid property ID",
            });
        }
        const updatedProperty = await property_service_1.propertyService.updateProperty(propertyId, updateData);
        return res.status(200).json({
            success: true,
            message: "Property updated successfully",
            data: updatedProperty,
        });
    }
    catch (error) {
        if (error.message === "Property not found" ||
            error.message === "New owner not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update property",
        });
    }
});
exports.deleteProperty = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { id } = req.params;
        const propertyId = id;
        if (!propertyId) {
            return res.status(400).json({
                success: false,
                message: "Invalid property ID",
            });
        }
        await property_service_1.propertyService.deleteProperty(propertyId);
        return res.status(200).json({
            success: true,
            message: "Property deleted successfully",
        });
    }
    catch (error) {
        if (error.message === "Property not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        if (error.message ===
            "Cannot delete property with existing units. Delete units first.") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete property",
        });
    }
});
//# sourceMappingURL=property.controller.js.map