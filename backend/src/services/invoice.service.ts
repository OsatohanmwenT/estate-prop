import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../database";
import {
  invoices,
  leases,
  properties,
  propertyUnits,
  tenants,
  transactions,
} from "../database/schemas";
import {
  CreateInvoiceData,
  RecordPaymentData,
  UpdateInvoiceData,
} from "../types/lease";

class InvoiceService {
  async createInvoice(data: CreateInvoiceData) {
    const [invoice] = await db
      .insert(invoices)
      .values({
        organizationId: data.organizationId,
        tenantId: data.tenantId,
        leaseId: data.leaseId || null,
        type: data.type,
        description: data.description,
        amount: data.amount.toString(),
        amountPaid: "0",
        ownerAmount: data.ownerAmount?.toString(),
        managementFee: data.managementFee?.toString(),
        dueDate: data.dueDate,
        status: data.status || "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return invoice;
  }

  async getInvoiceById(invoiceId: string) {
    const [result] = await db
      .select({
        id: invoices.id,
        organizationId: invoices.organizationId,
        leaseId: invoices.leaseId,
        tenantId: invoices.tenantId,
        type: invoices.type,
        description: invoices.description,
        amount: invoices.amount,
        amountPaid: invoices.amountPaid,
        ownerAmount: invoices.ownerAmount,
        managementFee: invoices.managementFee,
        dueDate: invoices.dueDate,
        status: invoices.status,
        createdAt: invoices.createdAt,
        updatedAt: invoices.updatedAt,
        tenant: {
          id: tenants.id,
          fullName: tenants.fullName,
          email: tenants.email,
          phone: tenants.phone,
        },
        lease: {
          id: leases.id,
          startDate: leases.startDate,
          endDate: leases.endDate,
          status: leases.status,
          unitId: leases.unitId,
        },
        unit: {
          id: propertyUnits.id,
          code: propertyUnits.code,
          type: propertyUnits.type,
          status: propertyUnits.status,
          propertyId: propertyUnits.propertyId,
          propertyName: properties.name,
          propertyAddress: properties.address,
          propertyCity: properties.city,
          propertyState: properties.state,
        },
      })
      .from(invoices)
      .leftJoin(tenants, eq(invoices.tenantId, tenants.id))
      .leftJoin(leases, eq(invoices.leaseId, leases.id))
      .leftJoin(propertyUnits, eq(leases.unitId, propertyUnits.id))
      .leftJoin(properties, eq(propertyUnits.propertyId, properties.id))
      .where(eq(invoices.id, invoiceId))
      .limit(1);

    if (!result) return null;

    // Fetch transactions for this invoice
    const transactionsList = await db
      .select()
      .from(transactions)
      .where(eq(transactions.invoiceId, invoiceId))
      .orderBy(sql`${transactions.paidAt} DESC`);

    return {
      ...result,
      transactions: transactionsList,
    };
  }

  async getAllInvoices(options?: {
    status?: "pending" | "paid" | "overdue";
    leaseId?: string;
    tenantId?: string;
    propertyId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const {
      status,
      leaseId,
      tenantId,
      propertyId,
      startDate,
      endDate,
      limit = 15,
      offset = 0,
    } = options || {};

    const conditions = [];

    if (status) {
      conditions.push(eq(invoices.status, status));
    }
    if (leaseId) {
      conditions.push(eq(invoices.leaseId, leaseId));
    }
    if (startDate) {
      conditions.push(gte(invoices.dueDate, startDate));
    }
    if (endDate) {
      conditions.push(lte(invoices.dueDate, endDate));
    }

    if (tenantId) {
      conditions.push(eq(invoices.tenantId, tenantId));
    }

    // Always fetch with joins to include tenant and property info
    const results = await db
      .select({
        id: invoices.id,
        organizationId: invoices.organizationId,
        leaseId: invoices.leaseId,
        tenantId: invoices.tenantId,
        type: invoices.type,
        description: invoices.description,
        amount: invoices.amount,
        amountPaid: invoices.amountPaid,
        ownerAmount: invoices.ownerAmount,
        managementFee: invoices.managementFee,
        dueDate: invoices.dueDate,
        status: invoices.status,
        createdAt: invoices.createdAt,
        updatedAt: invoices.updatedAt,
        tenant: {
          id: tenants.id,
          fullName: tenants.fullName,
          email: tenants.email,
          phone: tenants.phone,
        },
        lease: {
          id: leases.id,
          startDate: leases.startDate,
          endDate: leases.endDate,
          status: leases.status,
          unitId: leases.unitId,
        },
        unit: {
          id: propertyUnits.id,
          code: propertyUnits.code,
          type: propertyUnits.type,
          status: propertyUnits.status,
          propertyId: propertyUnits.propertyId,
          propertyName: properties.name,
          propertyAddress: properties.address,
          propertyCity: properties.city,
          propertyState: properties.state,
        },
      })
      .from(invoices)
      .leftJoin(tenants, eq(invoices.tenantId, tenants.id))
      .leftJoin(leases, eq(invoices.leaseId, leases.id))
      .leftJoin(propertyUnits, eq(leases.unitId, propertyUnits.id))
      .leftJoin(properties, eq(propertyUnits.propertyId, properties.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(sql`${invoices.dueDate} DESC`);

    return results;
  }

  async getInvoicesCount(options?: {
    status?: "pending" | "paid" | "overdue";
    leaseId?: string;
    tenantId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { status, leaseId, tenantId, startDate, endDate } = options || {};
    const conditions = [];

    if (status) {
      conditions.push(eq(invoices.status, status));
    }
    if (leaseId) {
      conditions.push(eq(invoices.leaseId, leaseId));
    }
    if (startDate) {
      conditions.push(gte(invoices.dueDate, startDate));
    }
    if (endDate) {
      conditions.push(lte(invoices.dueDate, endDate));
    }

    if (tenantId) {
      const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(invoices)
        .innerJoin(leases, eq(invoices.leaseId, leases.id))
        .where(
          conditions.length > 0
            ? and(eq(leases.tenantId, tenantId), ...conditions)
            : eq(leases.tenantId, tenantId)
        );

      return Number(result.count);
    }

    if (conditions.length > 0) {
      const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(invoices)
        .where(and(...conditions));

      return Number(result.count);
    }

    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(invoices);

    return Number(result.count);
  }

  async updateInvoice(invoiceId: string, data: UpdateInvoiceData) {
    const [updatedInvoice] = await db
      .update(invoices)
      .set(data)
      .where(eq(invoices.id, invoiceId))
      .returning();

    return updatedInvoice;
  }

  async recordPayment(
    invoiceId: string,
    data: RecordPaymentData,
    userId?: string
  ) {
    return await db.transaction(async (tx) => {
      // Get current invoice state
      const [invoice] = await tx
        .select()
        .from(invoices)
        .where(eq(invoices.id, invoiceId))
        .limit(1);

      if (!invoice) {
        throw new Error("Invoice not found");
      }

      // Calculate new amount paid
      const currentPaid = parseFloat(invoice.amountPaid || "0");
      const paymentAmount = data.amount;
      const newAmountPaid = currentPaid + paymentAmount;
      const totalAmount = parseFloat(invoice.amount);

      // Determine new status
      let newStatus: "paid" | "partial" | "pending" = invoice.status as any;
      if (newAmountPaid >= totalAmount) {
        newStatus = "paid";
      } else if (newAmountPaid > 0) {
        newStatus = "partial";
      }

      // Update invoice
      const [updatedInvoice] = await tx
        .update(invoices)
        .set({
          status: newStatus,
          amountPaid: newAmountPaid.toString(),
          updatedAt: new Date(),
        })
        .where(eq(invoices.id, invoiceId))
        .returning();

      // Create transaction record
      const [transaction] = await tx
        .insert(transactions)
        .values({
          organizationId: invoice.organizationId,
          invoiceId: invoice.id,
          tenantId: invoice.tenantId,
          amount: paymentAmount.toString(),
          method: data.method,
          reference: data.reference,
          paidAt: new Date(data.paidAt),
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          recordedBy: userId,
          receiptUrl: data.receiptUrl,
          createdAt: new Date(),
        })
        .returning();

      // If invoice is now fully paid and has a draft lease, activate it
      if (newStatus === "paid" && invoice.leaseId) {
        // Check lease status
        const [lease] = await tx
          .select()
          .from(leases)
          .where(eq(leases.id, invoice.leaseId))
          .limit(1);

        if (lease && lease.status === "draft") {
          const leaseService = require("./lease.service").default;
          await leaseService.activateLease(invoice.leaseId);
        }
      }

      return { invoice: updatedInvoice, transaction };
    });
  }

  async deleteInvoice(invoiceId: string) {
    const [deletedInvoice] = await db
      .delete(invoices)
      .where(eq(invoices.id, invoiceId))
      .returning();

    return deletedInvoice;
  }

  async getInvoicesByLease(leaseId: string) {
    return await db
      .select()
      .from(invoices)
      .where(eq(invoices.leaseId, leaseId))
      .orderBy(sql`${invoices.dueDate} DESC`);
  }

  async getOverdueInvoices(): Promise<any[]> {
    const now = new Date();

    return await db
      .select({
        id: invoices.id,
        leaseId: invoices.leaseId,
        amount: invoices.amount,
        dueDate: invoices.dueDate,
        status: invoices.status,
        createdAt: invoices.createdAt,
        lease_startDate: leases.startDate,
        lease_endDate: leases.endDate,
        lease_tenantId: leases.tenantId,
        tenant_id: tenants.id,
        tenant_name: tenants.fullName,
        tenant_email: tenants.email,
        property_id: properties.id,
        property_name: properties.name,
        property_address: properties.address,
      })
      .from(invoices)
      .innerJoin(leases, eq(invoices.leaseId, leases.id))
      .innerJoin(tenants, eq(tenants.id, leases.tenantId))
      .innerJoin(propertyUnits, eq(leases.unitId, propertyUnits.id))
      .innerJoin(properties, eq(propertyUnits.propertyId, properties.id))
      .where(and(eq(invoices.status, "pending"), lte(invoices.dueDate, now)))
      .orderBy(sql`${invoices.dueDate} ASC`);
  }

  async updateOverdueInvoices() {
    const now = new Date();

    const overdueInvoices = await db
      .update(invoices)
      .set({
        status: "overdue",
      })
      .where(and(eq(invoices.status, "pending"), lte(invoices.dueDate, now)))
      .returning();

    return overdueInvoices;
  }

  async getUpcomingInvoices(daysAhead: number = 7): Promise<any[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return await db
      .select({
        id: invoices.id,
        leaseId: invoices.leaseId,
        amount: invoices.amount,
        dueDate: invoices.dueDate,
        status: invoices.status,
        createdAt: invoices.createdAt,
        lease_startDate: leases.startDate,
        lease_endDate: leases.endDate,
        lease_tenantId: leases.tenantId,
        tenant_id: tenants.id,
        tenant_name: tenants.fullName,
        tenant_email: tenants.email,
        property_id: properties.id,
        property_name: properties.name,
        property_address: properties.address,
      })
      .from(invoices)
      .innerJoin(leases, eq(invoices.leaseId, leases.id))
      .innerJoin(tenants, eq(tenants.id, leases.tenantId))
      .innerJoin(propertyUnits, eq(leases.unitId, propertyUnits.id))
      .innerJoin(properties, eq(propertyUnits.propertyId, properties.id))
      .where(
        and(
          eq(invoices.status, "pending"),
          gte(invoices.dueDate, now),
          lte(invoices.dueDate, futureDate)
        )
      )
      .orderBy(sql`${invoices.dueDate} ASC`);
  }

  async generateRecurringInvoice(leaseId: string) {
    const [lease] = await db
      .select()
      .from(leases)
      .where(eq(leases.id, leaseId))
      .limit(1);

    if (!lease || lease.status !== "active") {
      throw new Error("Lease not found or not active");
    }

    const [lastInvoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.leaseId, leaseId))
      .orderBy(sql`${invoices.dueDate} DESC`)
      .limit(1);

    let nextDueDate: Date;
    if (lastInvoice) {
      nextDueDate = new Date(lastInvoice.dueDate);
    } else {
      nextDueDate = new Date(lease.startDate);
    }

    switch (lease.billingCycle) {
      case "monthly":
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        break;
      case "quarterly":
        nextDueDate.setMonth(nextDueDate.getMonth() + 3);
        break;
      case "biannually":
        nextDueDate.setMonth(nextDueDate.getMonth() + 6);
        break;
      case "annually":
        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
        break;
    }

    if (nextDueDate > new Date(lease.endDate)) {
      return null;
    }

    const [existingInvoice] = await db
      .select()
      .from(invoices)
      .where(
        and(eq(invoices.leaseId, leaseId), eq(invoices.dueDate, nextDueDate))
      )
      .limit(1);

    if (existingInvoice) {
      return null;
    }

    const [newInvoice] = await db
      .insert(invoices)
      .values({
        organizationId: lease.organizationId,
        tenantId: lease.tenantId,
        leaseId: leaseId,
        type: "rent",
        description: `Recurring ${lease.billingCycle} rent payment`,
        amount: lease.rentAmount,
        dueDate: nextDueDate,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return newInvoice;
  }

  async getInvoiceStats(options?: {
    tenantId?: string;
    propertyId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { tenantId, propertyId, startDate, endDate } = options || {};
    const conditions = [];

    if (startDate) {
      conditions.push(gte(invoices.dueDate, startDate));
    }
    if (endDate) {
      conditions.push(lte(invoices.dueDate, endDate));
    }

    let query: any = db
      .select({
        status: invoices.status,
        count: sql<number>`count(*)`,
        totalAmount: sql<number>`sum(${invoices.amount})`,
      })
      .from(invoices);

    if (tenantId) {
      query = query.innerJoin(leases, eq(invoices.leaseId, leases.id));
      conditions.push(eq(leases.tenantId, tenantId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const stats = await query.groupBy(invoices.status);

    return stats;
  }
}

export default new InvoiceService();
