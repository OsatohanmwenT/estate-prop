import { Request, Response } from "express";
import { propertyService } from "../services/property.service";
import { GetPropertiesParams } from "../types/property";
import { asyncHandler } from "../utils/asyncHandler";

export const getAllProperties = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        limit = 10,
        page = 1,
        search,
        city,
        state,
        category,
        ownerId,
      } = req.query as GetPropertiesParams;
      const offset = (Number(page) - 1) * Number(limit);

      const user = (req as any).user;
      const organizationId = user?.organizationId;

      if (!organizationId) {
        return res.status(403).json({
          success: false,
          message: "Organization ID required",
        });
      }

      const [allProperties, count] = await Promise.all([
        propertyService.getAllProperties({
          limit: Number(limit),
          offset: Number(offset),
          search,
          city,
          state,
          category,
          ownerId,
          organizationId,
        }),
        propertyService.getPropertiesCount({
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
          nextPage:
            Number(page) * Number(limit) < count ? Number(page) + 1 : null,
          prevPage: Number(page) > 1 ? Number(page) - 1 : null,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

export const createProperty = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const propertyData = req.body;
      const newProperty = await propertyService.createProperty(propertyData);
      res.status(201).json({
        success: true,
        data: newProperty,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      }
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

export const getPropertyById = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const propertyId = id;

      if (!propertyId) {
        return res.status(400).json({
          success: false,
          message: "Invalid property ID",
        });
      }

      const property = await propertyService.getPropertyById(propertyId);

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
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve property",
      });
    }
  }
);

export const updateProperty = asyncHandler(
  async (req: Request, res: Response) => {
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

      const updatedProperty = await propertyService.updateProperty(
        propertyId,
        updateData
      );

      return res.status(200).json({
        success: true,
        message: "Property updated successfully",
        data: updatedProperty,
      });
    } catch (error: any) {
      if (
        error.message === "Property not found" ||
        error.message === "New owner not found"
      ) {
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
  }
);

export const deleteProperty = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const propertyId = id;

      if (!propertyId) {
        return res.status(400).json({
          success: false,
          message: "Invalid property ID",
        });
      }

      await propertyService.deleteProperty(propertyId);

      return res.status(200).json({
        success: true,
        message: "Property deleted successfully",
      });
    } catch (error: any) {
      if (error.message === "Property not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message ===
        "Cannot delete property with existing units. Delete units first."
      ) {
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
  }
);
