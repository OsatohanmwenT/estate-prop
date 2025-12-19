import { Request, Response, RequestHandler } from "express";
import { unitService } from "../services/unit.service";
import { asyncHandler } from "../utils/asyncHandler";
import { UNIT_STATUS } from "../types/property";

export const getUnitsByProperty: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { propertyId } = req.params;
      const { limit = 20, page = 1, status } = req.query;
      const user = (req as any).user;

      const offset = (Number(page) - 1) * Number(limit);

      let statusValue: UNIT_STATUS | undefined;
      if (
        typeof status === "string" &&
        (status === "vacant" || status === "occupied")
      ) {
        statusValue = status;
      }

      // Fetch units and count in parallel
      const [unitsData, totalCount] = await Promise.all([
        statusValue
          ? unitService.getUnitsByPropertyIdAndStatus(
              propertyId,
              statusValue,
              Number(limit),
              offset,
              user.organizationId
            )
          : unitService.getUnitsByPropertyId(
              propertyId,
              Number(limit),
              offset,
              user.organizationId
            ),
        unitService.getUnitsCountByProperty(
          propertyId,
          statusValue,
          user.organizationId
        ),
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
          nextPage:
            Number(page) * Number(limit) < totalCount ? Number(page) + 1 : null,
          prevPage: Number(page) > 1 ? Number(page) - 1 : null,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve units",
      });
    }
  }
);

export const getUnitById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { propertyId, unitId } = req.params;

      const unit = await unitService.getUnitById(unitId, propertyId);

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
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve unit",
      });
    }
  }
);

export const createUnit: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { propertyId } = req.params;
      const {
        code,
        type,
        floor,
        bedrooms,
        bathrooms,
        status,
        rentAmount,
        unitSize,
        condition,
        description,
        amenities,
        managementFeePercentage,
        managementFeeFixed,
      } = req.body;

      const propertyExists = await unitService.checkPropertyExists(propertyId);
      if (!propertyExists) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      const existingUnit = await unitService.findUnitByCodeAndProperty(
        code,
        propertyId
      );
      if (existingUnit) {
        return res.status(400).json({
          success: false,
          message: "A unit with this code already exists in this property",
        });
      }

      const newUnit = await unitService.createUnit({
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
    } catch (error: any) {
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
  }
);

export const updateUnit: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { propertyId, unitId } = req.params;

      const existingUnit = await unitService.getUnitById(unitId, propertyId);
      if (!existingUnit) {
        return res.status(404).json({
          success: false,
          message: "Unit not found",
        });
      }

      if (req.body.code && req.body.code !== existingUnit.code) {
        const duplicateUnit = await unitService.findUnitByCodeAndProperty(
          req.body.code,
          propertyId
        );
        if (duplicateUnit) {
          return res.status(400).json({
            success: false,
            message: "A unit with this code already exists in this property",
          });
        }
      }

      const updatedUnit = await unitService.updateUnit(
        unitId,
        propertyId,
        req.body
      );

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
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update unit",
      });
    }
  }
);

export const deleteUnit: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { propertyId, unitId } = req.params;

      const deletedUnit = await unitService.deleteUnit(unitId, propertyId);

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
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to delete unit",
      });
    }
  }
);

export const getUnitStats: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { propertyId } = req.params;

      const stats = await unitService.getUnitStatsByProperty(propertyId);

      res.status(200).json({
        success: true,
        message: "Unit statistics retrieved successfully",
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve unit statistics",
      });
    }
  }
);

export const getAllUnits: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
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
        unitService.getAllUnitsByOrganization(
          organizationId,
          Number(limit),
          offset
        ),
        unitService.getAllUnitsCountByOrganization(organizationId),
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
          nextPage:
            Number(page) * Number(limit) < totalCount ? Number(page) + 1 : null,
          prevPage: Number(page) > 1 ? Number(page) - 1 : null,
        },
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve units",
      });
    }
  }
);
