import {
  CreateInvoiceData,
  Invoice,
  InvoiceStats,
  RecordPaymentData,
  UpdateInvoiceData,
} from "~/types/invoice";
import { BaseService } from "./baseService";

class InvoiceService extends BaseService {
  constructor() {
    super("invoices");
  }

  /**
   * Get all invoices with optional filters
   */
  async getAllInvoices(params?: {
    status?: "draft" | "pending" | "paid" | "partial" | "overdue" | "void";
    leaseId?: string;
    tenantId?: string;
    propertyId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    page?: number;
  }): Promise<Invoice[]> {
    const queryParams = new URLSearchParams();

    if (params?.status) queryParams.append("status", params.status);
    if (params?.leaseId) queryParams.append("leaseId", params.leaseId);
    if (params?.tenantId) queryParams.append("tenantId", params.tenantId);
    if (params?.propertyId) queryParams.append("propertyId", params.propertyId);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.page) queryParams.append("page", params.page.toString());

    const url = queryParams.toString() ? `/?${queryParams.toString()}` : "/";
    return this.get<Invoice[]>(url);
  }

  /**
   * Get a single invoice by ID
   */
  async getInvoiceById(invoiceId: string): Promise<Invoice> {
    return this.get<Invoice>(`/${invoiceId}`);
  }

  /**
   * Create a new invoice
   */
  async createInvoice(data: CreateInvoiceData): Promise<Invoice> {
    return this.post<Invoice, CreateInvoiceData>("/", data);
  }

  /**
   * Update an existing invoice
   */
  async updateInvoice(
    invoiceId: string,
    data: UpdateInvoiceData
  ): Promise<Invoice> {
    return this.put<Invoice, UpdateInvoiceData>(`/${invoiceId}`, data);
  }

  /**
   * Record payment for an invoice
   */
  async recordPayment(
    invoiceId: string,
    data: RecordPaymentData
  ): Promise<Invoice> {
    return this.patch<Invoice, RecordPaymentData>(
      `/${invoiceId}/payment`,
      data
    );
  }

  /**
   * Delete an invoice
   */
  async deleteInvoice(invoiceId: string): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`/${invoiceId}`);
  }

  /**
   * Get invoices by lease ID
   */
  async getInvoicesByLease(leaseId: string): Promise<Invoice[]> {
    return this.get<Invoice[]>(`/lease/${leaseId}`);
  }

  /**
   * Get overdue invoices
   */
  async getOverdueInvoices(): Promise<Invoice[]> {
    return this.get<Invoice[]>("/overdue");
  }

  /**
   * Get upcoming invoices
   */
  async getUpcomingInvoices(days?: number): Promise<Invoice[]> {
    const url = days ? `/upcoming?days=${days}` : "/upcoming";
    return this.get<Invoice[]>(url);
  }

  /**
   * Generate recurring invoice for a lease
   */
  async generateRecurringInvoice(leaseId: string): Promise<Invoice> {
    return this.post<Invoice, {}>(`/generate/${leaseId}`, {});
  }

  /**
   * Get invoice statistics
   */
  async getInvoiceStats(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<InvoiceStats[]> {
    const queryParams = new URLSearchParams();

    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const url = queryParams.toString()
      ? `/stats?${queryParams.toString()}`
      : "/stats";
    return this.get<InvoiceStats[]>(url);
  }
}

export const invoiceService = new InvoiceService();
