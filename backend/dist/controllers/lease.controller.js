"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaseByUnit = exports.getActiveLeasesByTenant = exports.terminateLease = exports.updateLease = exports.getAllLeases = exports.getLeaseById = exports.createLease = exports.getLeaseStats = void 0;
const lease_service_1 = __importDefault(require("../services/lease.service"));
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getLeaseStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const organizationId = user?.organizationId;
    if (!organizationId) {
        return res.status(400).json({
            success: false,
            message: "User organization or ID not found",
        });
    }
    const stats = await lease_service_1.default.getLeaseStats(organizationId);
    res.status(200).json({
        success: true,
        data: stats,
    });
});
exports.createLease = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { startDate, endDate, rentAmount, tenantId, unitId, billingCycle, cautionDeposit, agencyFee, legalFee, notes, agreementUrl, } = req.body;
    const user = req.user;
    const organizationId = user?.organizationId;
    const userId = user?.id;
    if (!organizationId || !userId) {
        return res.status(400).json({
            success: false,
            message: "User organization or ID not found",
        });
    }
    try {
        const result = await lease_service_1.default.createLease({
            organizationId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            rentAmount,
            tenantId,
            unitId,
            billingCycle,
            cautionDeposit,
            agencyFee,
            legalFee,
            notes,
            agreementUrl,
            createdBy: userId,
        });
        res.status(201).json({
            success: true,
            message: "Lease offer created successfully. An invoice has been generated for the tenant.",
            data: {
                lease: result.lease,
                invoice: result.invoice,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create lease",
        });
    }
});
exports.getLeaseById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const leaseId = req.params.leaseId;
    const lease = await lease_service_1.default.getLeaseById(leaseId);
    if (!lease) {
        res.status(404).json({
            success: false,
            message: "Lease not found",
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: lease,
    });
});
exports.getAllLeases = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { status, tenantId, unitId, propertyId, page = "1", limit = "15", } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    const organizationId = req.organizationId;
    const [leases, totalCount] = await Promise.all([
        lease_service_1.default.getAllLeases({
            status: status,
            tenantId: tenantId,
            unitId: unitId,
            propertyId: propertyId,
            organizationId,
            limit: limitNum,
            offset,
        }),
        lease_service_1.default.getLeasesCount({
            status: status,
            tenantId: tenantId,
            unitId: unitId,
            propertyId: propertyId,
            organizationId,
        }),
    ]);
    res.status(200).json({
        success: true,
        data: leases,
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalCount,
            limit: limitNum,
        },
    });
});
exports.updateLease = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const leaseId = req.params.leaseId;
    const updateData = { ...req.body };
    if (updateData.startDate) {
        updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
        updateData.endDate = new Date(updateData.endDate);
    }
    try {
        const updatedLease = await lease_service_1.default.updateLease(leaseId, updateData);
        if (!updatedLease) {
            return res.status(404).json({
                success: false,
                message: "Lease not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Lease updated successfully",
            data: updatedLease,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update lease",
        });
    }
});
exports.terminateLease = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const leaseId = req.params.leaseId;
    const { terminationDate, reason } = req.body;
    try {
        const terminatedLease = await lease_service_1.default.terminateLease(leaseId, {
            terminationDate,
            reason,
        });
        if (!terminatedLease) {
            return res.status(404).json({
                success: false,
                message: "Lease not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Lease terminated successfully",
            data: terminatedLease,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to terminate lease",
        });
    }
});
exports.getActiveLeasesByTenant = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { tenantId } = req.params;
    const leases = await lease_service_1.default.getActiveLeasesByTenant(tenantId);
    res.status(200).json({
        success: true,
        data: leases,
        count: leases.length,
    });
});
exports.getLeaseByUnit = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const unitId = req.params.unitId;
    const lease = await lease_service_1.default.getLeaseByUnit(unitId);
    if (!lease) {
        res.status(404).json({
            success: false,
            message: "No lease found for this unit",
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: lease,
    });
});
//# sourceMappingURL=lease.controller.js.map