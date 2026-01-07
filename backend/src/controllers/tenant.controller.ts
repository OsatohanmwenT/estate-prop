import { Request, Response } from "express";
import { tenantService } from "../services/tenant.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getAllTenants = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { limit = 20, page = 1, search } = req.query;
      const user = (req as any).user;
      const offset = (Number(page) - 1) * Number(limit);

      const [tenants, totalCount] = await Promise.all([
        tenantService.getAllTenants(
          Number(limit),
          offset,
          search as string | undefined,
          user.organizationId
        ),
        tenantService.getTenantsCount(
          search as string | undefined,
          user.organizationId
        ),
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
          nextPage:
            Number(page) * Number(limit) < totalCount ? Number(page) + 1 : null,
          prevPage: Number(page) > 1 ? Number(page) - 1 : null,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve tenants",
      });
    }
  }
);

export const getTenantById = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const tenant = await tenantService.getTenantById(id);

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
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve tenant",
      });
    }
  }
);

export const createTenant = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        fullName,
        email,
        phone,
        nokName,
        nokPhone,
        annualIncome,
        metadata,
      } = req.body;
      const user = (req as any).user;

      // Check if email already exists (only if provided)
      if (email) {
        const emailExists = await tenantService.checkTenantEmailExists(email);
        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: "A tenant with this email already exists",
          });
        }
      }

      const newTenant = await tenantService.addTenant({
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
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create tenant",
      });
    }
  }
);

export const updateTenant = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {
        fullName,
        email,
        phone,
        nokName,
        nokPhone,
        annualIncome,
        metadata,
      } = req.body;

      const existingTenant = await tenantService.getTenantById(id);
      if (!existingTenant) {
        return res.status(404).json({
          success: false,
          message: "Tenant not found",
        });
      }

      // Check if email is being changed and if it already exists
      if (email && email !== existingTenant.email) {
        const emailExists = await tenantService.checkTenantEmailExists(
          email,
          id
        );
        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: "A tenant with this email already exists",
          });
        }
      }

      const updatedTenant = await tenantService.updateTenant(id, {
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
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update tenant",
      });
    }
  }
);

export const deleteTenant = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const deletedTenant = await tenantService.deleteTenantById(id);

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
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to delete tenant",
      });
    }
  }
);
