"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoiceStats = exports.generateRecurringInvoice = exports.getUpcomingInvoices = exports.getOverdueInvoices = exports.getInvoicesByLease = exports.deleteInvoice = exports.recordPayment = exports.updateInvoice = exports.getAllInvoices = exports.getInvoiceById = exports.createInvoice = void 0;
const invoice_service_1 = __importDefault(require("../services/invoice.service"));
const asyncHandler_1 = require("../utils/asyncHandler");
exports.createInvoice = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { tenantId, leaseId, type, description, amount, dueDate, status, ownerAmount, managementFee, } = req.body;
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
        res.status(400).json({
            success: false,
            message: "Organization ID is required",
        });
        return;
    }
    const invoice = await invoice_service_1.default.createInvoice({
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
});
exports.getInvoiceById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { invoiceId } = req.params;
    const invoice = await invoice_service_1.default.getInvoiceById(invoiceId);
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
});
exports.getAllInvoices = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { status, leaseId, tenantId, propertyId, startDate, endDate, page = "1", limit = "15", } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    const filters = {
        status: status,
        leaseId: leaseId,
        tenantId: tenantId,
        propertyId: propertyId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
    };
    const paginatedQuery = {
        ...filters,
        limit: limitNum,
        offset,
    };
    const [invoices, totalCount] = await Promise.all([
        invoice_service_1.default.getAllInvoices(paginatedQuery),
        invoice_service_1.default.getInvoicesCount(filters),
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
});
exports.updateInvoice = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { invoiceId } = req.params;
    const updateData = { ...req.body };
    if (updateData.dueDate) {
        updateData.dueDate = new Date(updateData.dueDate);
    }
    const existingInvoice = await invoice_service_1.default.getInvoiceById(invoiceId);
    if (!existingInvoice) {
        res.status(404).json({
            success: false,
            message: "Invoice not found",
        });
        return;
    }
    const updatedInvoice = await invoice_service_1.default.updateInvoice(invoiceId, updateData);
    res.status(200).json({
        success: true,
        message: "Invoice updated successfully",
        data: updatedInvoice,
    });
});
exports.recordPayment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { invoiceId } = req.params;
    const { amount, method, reference, paidAt, bankName, accountNumber, receiptUrl, } = req.body;
    const userId = req.user?.id;
    const existingInvoice = await invoice_service_1.default.getInvoiceById(invoiceId);
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
    const balance = parseFloat(existingInvoice.amount) -
        parseFloat(existingInvoice.amountPaid || "0");
    if (amount > balance) {
        res.status(400).json({
            success: false,
            message: `Payment amount (${amount}) exceeds remaining balance (${balance})`,
        });
        return;
    }
    const result = await invoice_service_1.default.recordPayment(invoiceId, {
        amount,
        method,
        reference,
        paidAt,
        bankName,
        accountNumber,
        receiptUrl,
    }, userId);
    res.status(200).json({
        success: true,
        message: "Payment recorded successfully",
        data: result,
    });
});
exports.deleteInvoice = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { invoiceId } = req.params;
    const existingInvoice = await invoice_service_1.default.getInvoiceById(invoiceId);
    if (!existingInvoice) {
        res.status(404).json({
            success: false,
            message: "Invoice not found",
        });
        return;
    }
    await invoice_service_1.default.deleteInvoice(invoiceId);
    res.status(200).json({
        success: true,
        message: "Invoice deleted successfully",
    });
});
exports.getInvoicesByLease = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const leaseId = req.params.leaseId;
    const invoices = await invoice_service_1.default.getInvoicesByLease(leaseId);
    res.status(200).json({
        success: true,
        data: invoices,
        count: invoices.length,
    });
});
exports.getOverdueInvoices = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const invoices = await invoice_service_1.default.getOverdueInvoices();
    res.status(200).json({
        success: true,
        data: invoices,
        count: invoices.length,
    });
});
exports.getUpcomingInvoices = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { days = "7" } = req.query;
    const daysAhead = parseInt(days);
    const invoices = await invoice_service_1.default.getUpcomingInvoices(daysAhead);
    res.status(200).json({
        success: true,
        data: invoices,
        count: invoices.length,
    });
});
exports.generateRecurringInvoice = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const leaseId = req.params.leaseId;
    try {
        const invoice = await invoice_service_1.default.generateRecurringInvoice(leaseId);
        if (!invoice) {
            res.status(400).json({
                success: false,
                message: "Cannot generate invoice - may be beyond lease end date or already exists",
            });
            return;
        }
        res.status(201).json({
            success: true,
            message: "Recurring invoice generated successfully",
            data: invoice,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to generate invoice",
        });
    }
});
exports.getInvoiceStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { tenantId, propertyId, startDate, endDate } = req.query;
    const stats = await invoice_service_1.default.getInvoiceStats({
        tenantId: tenantId,
        propertyId: propertyId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
    });
    res.status(200).json({
        success: true,
        data: stats,
    });
});
//# sourceMappingURL=invoice.controller.js.map