"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUnits = exports.getUnitStats = exports.deleteUnit = exports.updateUnit = exports.createUnit = exports.getUnitById = exports.getUnitsByProperty = void 0;
const unit_service_1 = require("../services/unit.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getUnitsByProperty = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { limit = 20, page = 1, status } = req.query;
        const user = req.user;
        const offset = (Number(page) - 1) * Number(limit);
        let statusValue;
        if (typeof status === "string" &&
            (status === "vacant" || status === "occupied")) {
            statusValue = status;
        }
        const [unitsData, totalCount] = await Promise.all([
            statusValue
                ? unit_service_1.unitService.getUnitsByPropertyIdAndStatus(propertyId, statusValue, Number(limit), offset, user.organizationId)
                : unit_service_1.unitService.getUnitsByPropertyId(propertyId, Number(limit), offset, user.organizationId),
            unit_service_1.unitService.getUnitsCountByProperty(propertyId, statusValue, user.organizationId),
        ]);
        res.status(200).json({
            success: true,
            message: "Units retrieved successfully",
            data: unitsData,
            pagination: {
                total: totalCount,
                limit: Number(limit),
                page: Number(page),
                totalPages: Math.ceil(totalCount / Number(limit)),
                nextPage: Number(page) * Number(limit) < totalCount ? Number(page) + 1 : null,
                prevPage: Number(page) > 1 ? Number(page) - 1 : null,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve units",
        });
    }
});
exports.getUnitById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { propertyId, unitId } = req.params;
        const unit = await unit_service_1.unitService.getUnitById(unitId, propertyId);
        if (!unit) {
            return res.status(404).json({
                success: false,
                message: "Unit not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Unit retrieved successfully",
            data: unit,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve unit",
        });
    }
});
exports.createUnit = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { code, type, floor, bedrooms, bathrooms, status, rentAmount, unitSize, condition, description, amenities, managementFeePercentage, managementFeeFixed, } = req.body;
        const propertyExists = await unit_service_1.unitService.checkPropertyExists(propertyId);
        if (!propertyExists) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }
        const existingUnit = await unit_service_1.unitService.findUnitByCodeAndProperty(code, propertyId);
        if (existingUnit) {
            return res.status(400).json({
                success: false,
                message: "A unit with this code already exists in this property",
            });
        }
        const newUnit = await unit_service_1.unitService.createUnit({
            code,
            type,
            rentAmount,
            unitSize,
            status,
            condition,
            bedrooms,
            bathrooms,
            floor,
            propertyId,
            description,
            amenities,
            managementFeePercentage,
            managementFeeFixed,
        });
        return res.status(201).json({
            success: true,
            message: "Unit created successfully",
            data: newUnit[0],
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors,
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create unit",
        });
    }
});
exports.updateUnit = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { propertyId, unitId } = req.params;
        const existingUnit = await unit_service_1.unitService.getUnitById(unitId, propertyId);
        if (!existingUnit) {
            return res.status(404).json({
                success: false,
                message: "Unit not found",
            });
        }
        if (req.body.code && req.body.code !== existingUnit.code) {
            const duplicateUnit = await unit_service_1.unitService.findUnitByCodeAndProperty(req.body.code, propertyId);
            if (duplicateUnit) {
                return res.status(400).json({
                    success: false,
                    message: "A unit with this code already exists in this property",
                });
            }
        }
        const updatedUnit = await unit_service_1.unitService.updateUnit(unitId, propertyId, req.body);
        if (!updatedUnit) {
            return res.status(404).json({
                success: false,
                message: "Failed to update unit",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Unit updated successfully",
            data: updatedUnit,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update unit",
        });
    }
});
exports.deleteUnit = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { propertyId, unitId } = req.params;
        const deletedUnit = await unit_service_1.unitService.deleteUnit(unitId, propertyId);
        if (!deletedUnit) {
            return res.status(404).json({
                success: false,
                message: "Unit not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Unit deleted successfully",
            data: deletedUnit,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete unit",
        });
    }
});
exports.getUnitStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { propertyId } = req.params;
        const stats = await unit_service_1.unitService.getUnitStatsByProperty(propertyId);
        res.status(200).json({
            success: true,
            message: "Unit statistics retrieved successfully",
            data: stats,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve unit statistics",
        });
    }
});
exports.getAllUnits = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { limit = 20, page = 1 } = req.query;
        const organizationId = req.user?.organizationId;
        if (!organizationId) {
            return res.status(400).json({
                success: false,
                message: "Organization ID is required",
            });
        }
        const offset = (Number(page) - 1) * Number(limit);
        const [unitsData, totalCount] = await Promise.all([
            unit_service_1.unitService.getAllUnitsByOrganization(organizationId, Number(limit), offset),
            unit_service_1.unitService.getAllUnitsCountByOrganization(organizationId),
        ]);
        return res.status(200).json({
            success: true,
            message: "Units retrieved successfully",
            data: unitsData,
            pagination: {
                total: totalCount,
                limit: Number(limit),
                page: Number(page),
                totalPages: Math.ceil(totalCount / Number(limit)),
                nextPage: Number(page) * Number(limit) < totalCount ? Number(page) + 1 : null,
                prevPage: Number(page) > 1 ? Number(page) - 1 : null,
            },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve units",
        });
    }
});
//# sourceMappingURL=unit.controller.js.map