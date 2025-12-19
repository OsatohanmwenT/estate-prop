import { Request, Response } from "express";
import leaseService from "../services/lease.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getLeaseStats = asyncHandler(
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    const organizationId = user?.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "User organization or ID not found",
      });
    }

    const stats = await leaseService.getLeaseStats(organizationId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  }
);

export const createLease = asyncHandler(async (req: Request, res: Response) => {
  const {
    startDate,
    endDate,
    rentAmount,
    tenantId,
    unitId,
    billingCycle,
    cautionDeposit,
    agencyFee,
    legalFee,
    notes,
    agreementUrl,
  } = req.body;

  // Get organizationId and userId from auth middleware
  const user = (req as any).user;
  const organizationId = user?.organizationId;
  const userId = user?.id;

  if (!organizationId || !userId) {
    return res.status(400).json({
      success: false,
      message: "User organization or ID not found",
    });
  }

  try {
    const result = await leaseService.createLease({
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
      message:
        "Lease offer created successfully. An invoice has been generated for the tenant.",
      data: {
        lease: result.lease,
        invoice: result.invoice,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create lease",
    });
  }
});

export const getLeaseById = asyncHandler(
  async (req: Request, res: Response) => {
    const leaseId = req.params.leaseId;

    const lease = await leaseService.getLeaseById(leaseId);

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
  }
);

export const getAllLeases = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      status,
      tenantId,
      unitId,
      propertyId,
      page = "1",
      limit = "15",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Get organizationId from authenticated user context
    const organizationId = (req as any).organizationId;

    const [leases, totalCount] = await Promise.all([
      leaseService.getAllLeases({
        status: status as "active" | "terminated" | "expired" | undefined,
        tenantId: tenantId as string | undefined,
        unitId: unitId as string | undefined,
        propertyId: propertyId as string | undefined,
        organizationId,
        limit: limitNum,
        offset,
      }),
      leaseService.getLeasesCount({
        status: status as "active" | "terminated" | "expired" | undefined,
        tenantId: tenantId as string | undefined,
        unitId: unitId as string | undefined,
        propertyId: propertyId as string | undefined,
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
  }
);

export const updateLease = asyncHandler(async (req: Request, res: Response) => {
  const leaseId = req.params.leaseId;
  const updateData = { ...req.body };

  if (updateData.startDate) {
    updateData.startDate = new Date(updateData.startDate);
  }
  if (updateData.endDate) {
    updateData.endDate = new Date(updateData.endDate);
  }

  try {
    const updatedLease = await leaseService.updateLease(leaseId, updateData);

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
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update lease",
    });
  }
});

export const terminateLease = asyncHandler(
  async (req: Request, res: Response) => {
    const leaseId = req.params.leaseId;
    const { terminationDate, reason } = req.body;

    try {
      const terminatedLease = await leaseService.terminateLease(leaseId, {
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
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to terminate lease",
      });
    }
  }
);

export const getActiveLeasesByTenant = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.params;

    const leases = await leaseService.getActiveLeasesByTenant(tenantId);

    res.status(200).json({
      success: true,
      data: leases,
      count: leases.length,
    });
  }
);

export const getLeaseByUnit = asyncHandler(
  async (req: Request, res: Response) => {
    const unitId = req.params.unitId;

    const lease = await leaseService.getLeaseByUnit(unitId);

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
  }
);
