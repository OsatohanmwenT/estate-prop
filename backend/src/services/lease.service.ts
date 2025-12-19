import { and, desc, eq, lte, sql } from "drizzle-orm";
import { db } from "../database";
import {
  invoices,
  leases,
  properties,
  propertyUnits,
  tenants,
} from "../database/schemas";
import { CreateLeaseData, UpdateLeaseData } from "../types/lease";

class LeaseService {
  async createLease(data: CreateLeaseData) {
    return await db.transaction(async (tx) => {
      const [unit] = await tx
        .select()
        .from(propertyUnits)
        .where(eq(propertyUnits.id, data.unitId));

      if (!unit) {
        throw new Error("Unit not found");
      }

      if (unit.status && unit.status === "occupied") {
        throw new Error("Unit is occupied and cannot be leased");
      }

      const overlapQuery = await tx
        .select()
        .from(leases)
        .where(
          and(
            eq(leases.unitId, data.unitId),
            eq(leases.status, "active"),
            sql`(coalesce(${
              leases.endDate
            }, 'infinity'::timestamptz) >= ${sql`${data.startDate}::timestamptz`} AND ${
              leases.startDate
            } <= ${
              data.endDate
                ? sql`${data.endDate}::timestamptz`
                : sql`'infinity'::timestamptz`
            })`
          )
        )
        .limit(1);

      if (overlapQuery.length > 0) {
        throw new Error(
          "Unit already has an active lease for the requested period"
        );
      }

      // Create lease with 'draft' status
      const [lease] = await tx
        .insert(leases)
        .values({
          ...data,
          status: "draft",
        })
        .returning();

      // Calculate total invoice amount (rent + all fees)
      const rentAmount = parseFloat(data.rentAmount);
      const cautionDeposit = data.cautionDeposit
        ? parseFloat(data.cautionDeposit)
        : 0;
      const agencyFee = data.agencyFee ? parseFloat(data.agencyFee) : 0;
      const legalFee = data.legalFee ? parseFloat(data.legalFee) : 0;
      const totalAmount = rentAmount + cautionDeposit + agencyFee + legalFee;

      // Create initial invoice with all fees
      const [invoice] = await tx
        .insert(invoices)
        .values({
          organizationId: data.organizationId,
          tenantId: data.tenantId,
          leaseId: lease.id,
          type: "rent",
          description: `Initial payment for lease (Rent + Agency Fee + Legal Fee + Caution Deposit)`,
          amount: totalAmount.toString(),
          amountPaid: "0",
          ownerAmount: rentAmount.toString(),
          managementFee: (agencyFee + legalFee).toString(),
          dueDate: data.startDate,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      // Note: Unit remains 'vacant' until lease is activated (when invoice is paid)

      return { lease, invoice };
    });
  }

  async getLeaseStats(organizationId: string) {
    const [result] = await db
      .select({
        totalLeases: sql<number>`count(*)::int`,
        activeLeases: sql<number>`count(*) FILTER (WHERE status = 'active')::int`,
        pendingLeases: sql<number>`count(*) FILTER (WHERE status = 'pending')::int`,
        terminatedLeases: sql<number>`count(*) FILTER (WHERE status = 'terminated')::int`,
        expiredLeases: sql<number>`count(*) FILTER (WHERE status = 'expired')::int`,
        expiringSoon: sql<number>`count(*) FILTER (WHERE status = 'active' AND end_date <= (now() + interval '30 days'))::int`,
      })
      .from(leases)
      .where(eq(leases.organizationId, organizationId));

    return result;
  }

  async getLeaseById(leaseId: string) {
    const result = await db
      .select({
        id: leases.id,
        startDate: leases.startDate,
        endDate: leases.endDate,
        rentAmount: leases.rentAmount,
        status: leases.status,
        tenantId: leases.tenantId,
        billingCycle: leases.billingCycle,
        unitId: leases.unitId,
        cautionDeposit: leases.cautionDeposit,
        agencyFee: leases.agencyFee,
        legalFee: leases.legalFee,
        notes: leases.notes,
        agreementUrl: leases.agreementUrl,
        createdAt: leases.createdAt,
        updatedAt: leases.updatedAt,
        // Tenant info
        tenant: {
          id: tenants.id,
          fullName: tenants.fullName,
          email: tenants.email,
          phone: tenants.phone,
        },
        // Unit info
        unit: {
          id: propertyUnits.id,
          code: propertyUnits.code,
          type: propertyUnits.type,
          status: propertyUnits.status,
          propertyId: propertyUnits.propertyId,
        },
        // Property info
        property: {
          id: properties.id,
          name: properties.name,
          address: properties.address,
          city: properties.city,
          state: properties.state,
        },
      })
      .from(leases)
      .leftJoin(tenants, eq(leases.tenantId, tenants.id))
      .leftJoin(propertyUnits, eq(leases.unitId, propertyUnits.id))
      .leftJoin(properties, eq(propertyUnits.propertyId, properties.id))
      .where(eq(leases.id, leaseId))
      .limit(1);

    return result[0] || null;
  }

  async getAllLeases(options?: {
    status?: "active" | "terminated" | "expired";
    tenantId?: string;
    unitId?: string;
    propertyId?: string;
    organizationId?: string;
    limit?: number;
    offset?: number;
  }) {
    const {
      status,
      tenantId,
      unitId,
      propertyId,
      organizationId,
      limit = 15,
      offset = 0,
    } = options || {};

    const conditions = [];

    if (status) conditions.push(eq(leases.status, status));
    if (tenantId) conditions.push(eq(leases.tenantId, tenantId));
    if (unitId) conditions.push(eq(leases.unitId, unitId));
    if (propertyId) conditions.push(eq(propertyUnits.propertyId, propertyId));
    if (organizationId)
      conditions.push(eq(properties.organizationId, organizationId));

    return await db
      .select({
        id: leases.id,
        startDate: leases.startDate,
        endDate: leases.endDate,
        rentAmount: leases.rentAmount,
        status: leases.status,
        tenantId: leases.tenantId,
        billingCycle: leases.billingCycle,
        unitId: leases.unitId,
        cautionDeposit: leases.cautionDeposit,
        notes: leases.notes,
        agreementUrl: leases.agreementUrl,
        createdAt: leases.createdAt,
        updatedAt: leases.updatedAt,
        // Tenant info
        tenant: {
          id: tenants.id,
          fullName: tenants.fullName,
          email: tenants.email,
          phone: tenants.phone,
        },
        // Unit info
        unit: {
          id: propertyUnits.id,
          code: propertyUnits.code,
          type: propertyUnits.type,
          status: propertyUnits.status,
          propertyId: propertyUnits.propertyId,
        },
        // Property info
        property: {
          id: properties.id,
          name: properties.name,
          address: properties.address,
          city: properties.city,
          state: properties.state,
        },
      })
      .from(leases)
      .leftJoin(tenants, eq(leases.tenantId, tenants.id))
      .innerJoin(propertyUnits, eq(leases.unitId, propertyUnits.id))
      .innerJoin(properties, eq(propertyUnits.propertyId, properties.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(leases.createdAt));
  }

  async getLeasesCount(options?: {
    status?: "active" | "terminated" | "expired";
    tenantId?: string;
    unitId?: string;
    propertyId?: string;
    organizationId?: string;
  }) {
    const { status, tenantId, unitId, propertyId, organizationId } =
      options || {};
    const conditions = [];

    if (status) conditions.push(eq(leases.status, status));
    if (tenantId) conditions.push(eq(leases.tenantId, tenantId));
    if (unitId) conditions.push(eq(leases.unitId, unitId));
    if (propertyId) conditions.push(eq(propertyUnits.propertyId, propertyId));
    if (organizationId)
      conditions.push(eq(properties.organizationId, organizationId));

    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(leases)
      .innerJoin(propertyUnits, eq(leases.unitId, propertyUnits.id))
      .innerJoin(properties, eq(propertyUnits.propertyId, properties.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return Number(result.count);
  }

  async updateLease(leaseId: string, data: UpdateLeaseData) {
    const [updatedLease] = await db
      .update(leases)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(leases.id, leaseId))
      .returning();

    return updatedLease;
  }

  async terminateLease(
    leaseId: string,
    data?: { terminationDate?: string; reason?: string }
  ) {
    return await db.transaction(async (tx) => {
      const updateData: any = {
        status: "terminated",
        updatedAt: new Date(),
      };

      // Update notes with termination reason if provided
      if (data?.reason) {
        const [existingLease] = await tx
          .select({ notes: leases.notes })
          .from(leases)
          .where(eq(leases.id, leaseId));

        const terminationNote = `\n\n--- TERMINATED ---\nDate: ${
          data.terminationDate || new Date().toISOString().split("T")[0]
        }\nReason: ${data.reason}`;
        updateData.notes = existingLease?.notes
          ? existingLease.notes + terminationNote
          : terminationNote.trim();
      }

      const [terminatedLease] = await tx
        .update(leases)
        .set(updateData)
        .where(eq(leases.id, leaseId))
        .returning();

      if (terminatedLease) {
        await tx
          .update(propertyUnits)
          .set({ status: "vacant", updatedAt: new Date() })
          .where(eq(propertyUnits.id, terminatedLease.unitId));
      }

      return terminatedLease;
    });
  }

  async getActiveLeasesByTenant(tenantId: string) {
    return await db
      .select()
      .from(leases)
      .where(and(eq(leases.tenantId, tenantId), eq(leases.status, "active")))
      .orderBy(sql`${leases.createdAt} DESC`);
  }

  async getLeaseByUnit(unitId: string) {
    const [lease] = await db
      .select()
      .from(leases)
      .where(eq(leases.unitId, unitId))
      .orderBy(sql`${leases.createdAt} DESC`)
      .limit(1);

    return lease;
  }

  async updateExpiredLeases() {
    const now = new Date();

    return await db.transaction(async (tx) => {
      const expiredLeases = await tx
        .update(leases)
        .set({
          status: "expired",
          updatedAt: now,
        })
        .where(and(eq(leases.status, "active"), lte(leases.endDate, now)))
        .returning();

      if (expiredLeases.length > 0) {
        const unitIds = expiredLeases.map((lease) => lease.unitId);
        await tx
          .update(propertyUnits)
          .set({ status: "vacant", updatedAt: now })
          .where(
            sql`${propertyUnits.id} IN (${sql.join(
              unitIds.map((id) => sql`${id}`),
              sql`, `
            )})`
          );
      }

      return expiredLeases;
    });
  }

  async activateLease(leaseId: string) {
    return await db.transaction(async (tx) => {
      const [lease] = await tx
        .select()
        .from(leases)
        .where(eq(leases.id, leaseId))
        .limit(1);

      if (!lease) {
        throw new Error("Lease not found");
      }

      if (lease.status !== "draft") {
        throw new Error("Only draft leases can be activated");
      }

      // Update lease to active
      const [updatedLease] = await tx
        .update(leases)
        .set({
          status: "active",
          updatedAt: new Date(),
        })
        .where(eq(leases.id, leaseId))
        .returning();

      // Update unit to occupied
      await tx
        .update(propertyUnits)
        .set({ status: "occupied", updatedAt: new Date() })
        .where(eq(propertyUnits.id, lease.unitId));

      return updatedLease;
    });
  }
}

export default new LeaseService();
