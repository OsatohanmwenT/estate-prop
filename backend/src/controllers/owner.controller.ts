import { Request, Response } from "express";
import { ownerService } from "../services/owner.service";
import { asyncHandler } from "../utils/asyncHandler";

export const createOwner = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, address } = req.body;
    const user = (req as any).user;

    if (!user?.organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
    }

    const newOwner = await ownerService.createOwner({
      fullName,
      email: email || undefined,
      phone: phone || undefined,
      address: address || undefined,
      organizationId: user.organizationId,
      managedBy: user.id,
    });

    res.status(201).json({
      success: true,
      message: "Owner created successfully",
      data: newOwner,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create owner",
    });
  }
});

export const getAllOwners = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { search, managedBy, limit = 5, page = 1 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const [owners, count] = await Promise.all([
        ownerService.getAllOwners({
          search: search as string,
          managedBy: managedBy as string,
          limit: Number(limit),
          offset: offset,
        }),
        ownerService.getOwnersCount(),
      ]);

      res.status(200).json({
        success: true,
        message: "Owners retrieved successfully",
        data: {
          owners,
        },
        pagination: {
          total: count,
          limit: limit ? parseInt(limit as string) : 5,
          page: page ? parseInt(page as string) : 1,
          totalPages: Math.ceil(
            count / (limit ? parseInt(limit as string) : 5)
          ),
          nextPage:
            Number(page) * (limit ? parseInt(limit as string) : 5) < count
              ? Number(page) + 1
              : null,
          prevPage: Number(page) > 1 ? Number(page) - 1 : null,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve owners",
      });
    }
  }
);

export const getOwnerById = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { details } = req.query;

      // If details=true, return owner with statistics and properties
      if (details === "true") {
        const ownerWithDetails = await ownerService.getOwnerWithDetails(id);

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

      // Otherwise, return basic owner info
      const owner = await ownerService.findOwnerById(id);

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
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve owner",
      });
    }
  }
);

export const updateOwner = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedOwner = await ownerService.updateOwner(id, updateData);

    return res.status(200).json({
      success: true,
      message: "Owner updated successfully",
      data: updatedOwner,
    });
  } catch (error: any) {
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

export const deleteOwner = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await ownerService.deleteOwner(id);

    return res.status(200).json({
      success: true,
      message: "Owner deleted successfully",
    });
  } catch (error: any) {
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
