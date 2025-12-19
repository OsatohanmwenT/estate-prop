import { Request, Response } from "express";
import invoiceService from "../services/invoice.service";
import { InvoiceFilters, PaginatedInvoiceQuery } from "../types/lease";
import { asyncHandler } from "../utils/asyncHandler";

export const createInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      tenantId,
      leaseId,
      type,
      description,
      amount,
      dueDate,
      status,
      ownerAmount,
      managementFee,
    } = req.body;

    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
      return;
    }

    const invoice = await invoiceService.createInvoice({
      organizationId,
      tenantId,
      leaseId: leaseId || null,
      type,
      description,
      amount: typeof amount === "string" ? parseFloat(amount) : amount,
      dueDate: new Date(dueDate),
      status: status || "pending",
      ownerAmount: ownerAmount
        ? typeof ownerAmount === "string"
          ? parseFloat(ownerAmount)
          : ownerAmount
        : undefined,
      managementFee: managementFee
        ? typeof managementFee === "string"
          ? parseFloat(managementFee)
          : managementFee
        : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });
  }
);

export const getInvoiceById = asyncHandler(
  async (req: Request, res: Response) => {
    const { invoiceId } = req.params;

    const invoice = await invoiceService.getInvoiceById(invoiceId);

    if (!invoice) {
      res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  }
);

export const getAllInvoices = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      status,
      leaseId,
      tenantId,
      propertyId,
      startDate,
      endDate,
      page = "1",
      limit = "15",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const filters: InvoiceFilters = {
      status: status as InvoiceFilters["status"],
      leaseId: leaseId as string | undefined,
      tenantId: tenantId as string | undefined,
      propertyId: propertyId as string | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    };

    const paginatedQuery: PaginatedInvoiceQuery = {
      ...filters,
      limit: limitNum,
      offset,
    };

    const [invoices, totalCount] = await Promise.all([
      invoiceService.getAllInvoices(paginatedQuery),
      invoiceService.getInvoicesCount(filters),
    ]);

    res.status(200).json({
      success: true,
      data: invoices,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        limit: limitNum,
      },
    });
  }
);

export const updateInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    const { invoiceId } = req.params;
    const updateData = { ...req.body };

    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    const existingInvoice = await invoiceService.getInvoiceById(invoiceId);
    if (!existingInvoice) {
      res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
      return;
    }

    const updatedInvoice = await invoiceService.updateInvoice(
      invoiceId,
      updateData
    );

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: updatedInvoice,
    });
  }
);

export const recordPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { invoiceId } = req.params;
    const {
      amount,
      method,
      reference,
      paidAt,
      bankName,
      accountNumber,
      receiptUrl,
    } = req.body;
    const userId = req.user?.id;

    const existingInvoice = await invoiceService.getInvoiceById(invoiceId);
    if (!existingInvoice) {
      res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
      return;
    }

    if (existingInvoice.status === "paid") {
      res.status(400).json({
        success: false,
        message: "Invoice is already paid",
      });
      return;
    }

    const balance =
      parseFloat(existingInvoice.amount) -
      parseFloat(existingInvoice.amountPaid || "0");
    if (amount > balance) {
      res.status(400).json({
        success: false,
        message: `Payment amount (${amount}) exceeds remaining balance (${balance})`,
      });
      return;
    }

    const result = await invoiceService.recordPayment(
      invoiceId,
      {
        amount,
        method,
        reference,
        paidAt,
        bankName,
        accountNumber,
        receiptUrl,
      },
      userId
    );

    res.status(200).json({
      success: true,
      message: "Payment recorded successfully",
      data: result,
    });
  }
);

export const deleteInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    const { invoiceId } = req.params;

    const existingInvoice = await invoiceService.getInvoiceById(invoiceId);
    if (!existingInvoice) {
      res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
      return;
    }

    await invoiceService.deleteInvoice(invoiceId);

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  }
);

export const getInvoicesByLease = asyncHandler(
  async (req: Request, res: Response) => {
    const leaseId = req.params.leaseId;

    const invoices = await invoiceService.getInvoicesByLease(leaseId);

    res.status(200).json({
      success: true,
      data: invoices,
      count: invoices.length,
    });
  }
);

export const getOverdueInvoices = asyncHandler(
  async (req: Request, res: Response) => {
    const invoices = await invoiceService.getOverdueInvoices();

    res.status(200).json({
      success: true,
      data: invoices,
      count: invoices.length,
    });
  }
);

export const getUpcomingInvoices = asyncHandler(
  async (req: Request, res: Response) => {
    const { days = "7" } = req.query;
    const daysAhead = parseInt(days as string);

    const invoices = await invoiceService.getUpcomingInvoices(daysAhead);

    res.status(200).json({
      success: true,
      data: invoices,
      count: invoices.length,
    });
  }
);

export const generateRecurringInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    const leaseId = req.params.leaseId;

    try {
      const invoice = await invoiceService.generateRecurringInvoice(leaseId);

      if (!invoice) {
        res.status(400).json({
          success: false,
          message:
            "Cannot generate invoice - may be beyond lease end date or already exists",
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: "Recurring invoice generated successfully",
        data: invoice,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to generate invoice",
      });
    }
  }
);

export const getInvoiceStats = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, propertyId, startDate, endDate } = req.query;

    const stats = await invoiceService.getInvoiceStats({
      tenantId: tenantId as string | undefined,
      propertyId: propertyId as string | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  }
);
