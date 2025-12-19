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
