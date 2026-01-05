import { Request, Response } from "express";
import { organizationService } from "../services/organization.service";
import { asyncHandler } from "../utils/asyncHandler";

export const createOrganization = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
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

    // Check if user already has an organization
    const existingOrg = await organizationService.getOrganizationByUserId(
      userId
    );

    if (existingOrg) {
      return res.status(400).json({
        success: false,
        message: "You already belong to an organization",
      });
    }

    const organization = await organizationService.createOrganization({
      name: name.trim(),
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: { organization },
    });
  }
);

export const getMyOrganization = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const organization = await organizationService.getOrganizationByUserId(
      userId
    );

    return res.status(200).json({
      success: true,
      message: organization
        ? "Organization retrieved successfully"
        : "No organization found",
      data: { organization },
    });
  }
);

export const updateOrganization = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, logoUrl, address, contactEmail, contactPhone } = req.body;

    const updated = await organizationService.updateOrganization(id, {
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
  }
);

export const getMembers = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const members = await organizationService.getMembers(id);

  return res.status(200).json({
    success: true,
    message: "Members retrieved successfully",
    data: { members },
  });
});

export const inviteMember = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, role } = req.body;
    const invitedBy = (req as any).user?.id;

    if (!email || !role) {
      return res.status(400).json({
        success: false,
        message: "Email and role are required",
      });
    }

    try {
      const member = await organizationService.inviteMember(
        id,
        email,
        role,
        invitedBy
      );

      return res.status(201).json({
        success: true,
        message: "Member invited successfully",
        data: { member },
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export const updateMember = asyncHandler(
  async (req: Request, res: Response) => {
    const { memberId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const updated = await organizationService.updateMemberRole(memberId, role);

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
  }
);

export const removeMember = asyncHandler(
  async (req: Request, res: Response) => {
    const { memberId } = req.params;

    const removed = await organizationService.removeMember(memberId);

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
  }
);
