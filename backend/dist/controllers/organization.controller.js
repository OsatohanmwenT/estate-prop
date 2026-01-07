"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMember = exports.updateMember = exports.inviteMember = exports.getMembers = exports.updateOrganization = exports.getMyOrganization = exports.createOrganization = void 0;
const organization_service_1 = require("../services/organization.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.createOrganization = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    const { name } = req.body;
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    if (!name || typeof name !== "string" || name.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: "Organization name must be at least 2 characters",
        });
    }
    const existingOrg = await organization_service_1.organizationService.getOrganizationByUserId(userId);
    if (existingOrg) {
        return res.status(400).json({
            success: false,
            message: "You already belong to an organization",
        });
    }
    const organization = await organization_service_1.organizationService.createOrganization({
        name: name.trim(),
        userId,
    });
    return res.status(201).json({
        success: true,
        message: "Organization created successfully",
        data: { organization },
    });
});
exports.getMyOrganization = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    const organization = await organization_service_1.organizationService.getOrganizationByUserId(userId);
    return res.status(200).json({
        success: true,
        message: organization
            ? "Organization retrieved successfully"
            : "No organization found",
        data: { organization },
    });
});
exports.updateOrganization = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, logoUrl, address, contactEmail, contactPhone } = req.body;
    const updated = await organization_service_1.organizationService.updateOrganization(id, {
        name,
        logoUrl,
        address,
        contactEmail,
        contactPhone,
    });
    if (!updated) {
        return res.status(404).json({
            success: false,
            message: "Organization not found",
        });
    }
    return res.status(200).json({
        success: true,
        message: "Organization updated successfully",
        data: { organization: updated },
    });
});
exports.getMembers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const members = await organization_service_1.organizationService.getMembers(id);
    return res.status(200).json({
        success: true,
        message: "Members retrieved successfully",
        data: { members },
    });
});
exports.inviteMember = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { email, role } = req.body;
    const invitedBy = req.user?.id;
    if (!email || !role) {
        return res.status(400).json({
            success: false,
            message: "Email and role are required",
        });
    }
    try {
        const member = await organization_service_1.organizationService.inviteMember(id, email, role, invitedBy);
        return res.status(201).json({
            success: true,
            message: "Member invited successfully",
            data: { member },
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updateMember = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { memberId } = req.params;
    const { role } = req.body;
    if (!role) {
        return res.status(400).json({
            success: false,
            message: "Role is required",
        });
    }
    const updated = await organization_service_1.organizationService.updateMemberRole(memberId, role);
    if (!updated) {
        return res.status(404).json({
            success: false,
            message: "Member not found",
        });
    }
    return res.status(200).json({
        success: true,
        message: "Member role updated successfully",
        data: { member: updated },
    });
});
exports.removeMember = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { memberId } = req.params;
    const removed = await organization_service_1.organizationService.removeMember(memberId);
    if (!removed) {
        return res.status(404).json({
            success: false,
            message: "Member not found",
        });
    }
    return res.status(200).json({
        success: true,
        message: "Member removed successfully",
    });
});
//# sourceMappingURL=organization.controller.js.map