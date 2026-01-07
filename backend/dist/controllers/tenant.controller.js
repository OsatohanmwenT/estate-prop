"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTenant = exports.updateTenant = exports.createTenant = exports.getTenantById = exports.getAllTenants = void 0;
const tenant_service_1 = require("../services/tenant.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getAllTenants = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { limit = 20, page = 1, search } = req.query;
        const user = req.user;
        const offset = (Number(page) - 1) * Number(limit);
        const [tenants, totalCount] = await Promise.all([
            tenant_service_1.tenantService.getAllTenants(Number(limit), offset, search, user.organizationId),
            tenant_service_1.tenantService.getTenantsCount(search, user.organizationId),
        ]);
        res.status(200).json({
            success: true,
            message: "Tenants retrieved successfully",
            data: tenants,
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
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve tenants",
        });
    }
});
exports.getTenantById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { id } = req.params;
        const tenant = await tenant_service_1.tenantService.getTenantById(id);
        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Tenant retrieved successfully",
            data: tenant,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve tenant",
        });
    }
});
exports.createTenant = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { fullName, email, phone, nokName, nokPhone, annualIncome, metadata, } = req.body;
        const user = req.user;
        if (email) {
            const emailExists = await tenant_service_1.tenantService.checkTenantEmailExists(email);
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "A tenant with this email already exists",
                });
            }
        }
        const newTenant = await tenant_service_1.tenantService.addTenant({
            fullName,
            email: email || undefined,
            phone: phone || undefined,
            nokName,
            nokPhone,
            annualIncome,
            metadata,
            organizationId: user.organizationId,
        });
        res.status(201).json({
            success: true,
            message: "Tenant created successfully",
            data: newTenant[0],
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create tenant",
        });
    }
});
exports.updateTenant = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, phone, nokName, nokPhone, annualIncome, metadata, } = req.body;
        const existingTenant = await tenant_service_1.tenantService.getTenantById(id);
        if (!existingTenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found",
            });
        }
        if (email && email !== existingTenant.email) {
            const emailExists = await tenant_service_1.tenantService.checkTenantEmailExists(email, id);
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "A tenant with this email already exists",
                });
            }
        }
        const updatedTenant = await tenant_service_1.tenantService.updateTenant(id, {
            fullName,
            email,
            phone,
            nokName,
            nokPhone,
            annualIncome,
            metadata,
        });
        if (!updatedTenant) {
            return res.status(404).json({
                success: false,
                message: "Failed to update tenant",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Tenant updated successfully",
            data: updatedTenant,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update tenant",
        });
    }
});
exports.deleteTenant = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTenant = await tenant_service_1.tenantService.deleteTenantById(id);
        if (!deletedTenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Tenant deleted successfully",
            data: deletedTenant,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete tenant",
        });
    }
});
//# sourceMappingURL=tenant.controller.js.map