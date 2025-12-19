import { eq, and, lte, gte, sql } from "drizzle-orm";
import { db } from "../database";
import {
  rentPayments,
  leases,
  tenants,
  properties,
  propertyUnits,
} from "../database/schemas";

class DashboardService {
  /**
   * Calculate days between two dates
   */
  private calculateDaysDifference(date1: Date, date2: Date): number {
    const diffTime = date1.getTime() - date2.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  /**
   * Get total overdue rent amount and count of tenants with overdue payments
   */
  async getOverdueRentSummary() {
    const now = new Date();

    const result = await db
      .select({
        totalAmount: sql<string>`COALESCE(SUM(${rentPayments.amount}), 0)`,
        tenantCount: sql<number>`COUNT(DISTINCT ${leases.tenantId})`,
        invoiceCount: sql<number>`COUNT(${rentPayments.id})`,
      })
      .from(rentPayments)
      .innerJoin(leases, eq(rentPayments.leaseId, leases.id))
      .where(
        and(eq(rentPayments.status, "overdue"), lte(rentPayments.dueDate, now))
      );

    return {
      totalAmount: result[0]?.totalAmount || "0",
      tenantCount: Number(result[0]?.tenantCount) || 0,
      invoiceCount: Number(result[0]?.invoiceCount) || 0,
    };
  }

  /**
   * Get occupancy rate across all properties
   */
  async getOccupancyRate() {
    const result = await db
      .select({
        total: sql<number>`CAST(COUNT(*) AS INTEGER)`,
        occupied: sql<number>`CAST(SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) AS INTEGER)`,
        vacant: sql<number>`CAST(SUM(CASE WHEN status = 'vacant' THEN 1 ELSE 0 END) AS INTEGER)`,
      })
      .from(propertyUnits);

    const totalUnits = Number(result[0]?.total) || 0;
    const occupiedUnits = Number(result[0]?.occupied) || 0;
    const vacantUnits = Number(result[0]?.vacant) || 0;
    const occupancyRate =
      totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    return {
      occupancyRate,
      occupiedUnits,
      vacantUnits,
      totalUnits,
    };
  }

  /**
   * Get count of pending payments (paid but awaiting confirmation)
   */
  async getPendingPaymentsCount() {
    const result = await db
      .select({
        count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
        totalAmount: sql<string>`COALESCE(SUM(${rentPayments.amount}), 0)`,
      })
      .from(rentPayments)
      .where(
        and(
          eq(rentPayments.status, "pending"),
          sql`${rentPayments.paymentDate} IS NOT NULL`
        )
      );

    return {
      count: Number(result[0]?.count) || 0,
      totalAmount: result[0]?.totalAmount || "0",
    };
  }

  /**
   * Get leases expiring within the next specified days (default 60)
   */
  async getUpcomingLeaseExpirations(daysAhead: number = 60) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const expiringLeases = await db
      .select({
        lease_id: leases.id,
        lease_endDate: leases.endDate,
        lease_rentAmount: leases.rentAmount,
        tenant_id: tenants.id,
        tenant_name: tenants.fullName,
        tenant_email: tenants.email,
        tenant_phone: tenants.phone,
        unit_id: propertyUnits.id,
        unit_name: propertyUnits.name,
        property_id: properties.id,
        property_name: properties.name,
        property_address: properties.address,
      })
      .from(leases)
      .innerJoin(tenants, eq(leases.tenantId, tenants.id))
      .innerJoin(propertyUnits, eq(leases.unitId, propertyUnits.id))
      .innerJoin(properties, eq(propertyUnits.propertyId, properties.id))
      .where(
        and(
          eq(leases.status, "active"),
          gte(leases.endDate, now),
          lte(leases.endDate, futureDate)
        )
      )
      .orderBy(sql`${leases.endDate} ASC`)
      .limit(10);

    return expiringLeases.map((lease) => ({
      leaseId: lease.lease_id,
      endDate: lease.lease_endDate,
      rentAmount: lease.lease_rentAmount,
      tenant: {
        id: lease.tenant_id,
        name: lease.tenant_name,
        email: lease.tenant_email,
        phone: lease.tenant_phone,
      },
      unit: {
        id: lease.unit_id,
        name: lease.unit_name,
      },
      property: {
        id: lease.property_id,
        name: lease.property_name,
        address: lease.property_address,
      },
    }));
  }

  /**
   * Get upcoming lease items for dashboard - returns all matching leases without limit
   * Returns flattened structure with computed daysUntilExpiry
   */
  async getUpcomingLeaseItems(daysAhead: number = 60) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const expiringLeases = await db
      .select({
        lease_id: leases.id,
        lease_endDate: leases.endDate,
        tenant_id: tenants.id,
        tenant_name: tenants.fullName,
        tenant_email: tenants.email,
        tenant_phone: tenants.phone,
        unit_id: propertyUnits.id,
        unit_name: propertyUnits.name,
        property_id: properties.id,
        property_name: properties.name,
      })
      .from(leases)
      .innerJoin(tenants, eq(leases.tenantId, tenants.id))
      .innerJoin(propertyUnits, eq(leases.unitId, propertyUnits.id))
      .innerJoin(properties, eq(propertyUnits.propertyId, properties.id))
      .where(
        and(
          eq(leases.status, "active"),
          gte(leases.endDate, now),
          lte(leases.endDate, futureDate)
        )
      )
      .orderBy(sql`${leases.endDate} ASC`);

    return expiringLeases.map((lease) => ({
      id: lease.lease_id.toString(),
      tenantName: lease.tenant_name,
      unitInfo: `${lease.unit_name}, ${lease.property_name}`,
      expiryDate: lease.lease_endDate.toISOString(),
      daysUntilExpiry: this.calculateDaysDifference(
        new Date(lease.lease_endDate),
        now
      ),
      phoneNumber: lease.tenant_phone,
      email: lease.tenant_email,
    }));
  }

  /**
   * Get comprehensive dashboard summary with all metrics
   */
  async getDashboardSummary() {
    const [overdueRent, occupancy, pendingPayments, upcomingExpirations] =
      await Promise.all([
        this.getOverdueRentSummary(),
        this.getOccupancyRate(),
        this.getPendingPaymentsCount(),
        this.getUpcomingLeaseExpirations(60),
      ]);

    return {
      overdueRent: {
        totalAmount: overdueRent.totalAmount,
        tenantCount: overdueRent.tenantCount,
        invoiceCount: overdueRent.invoiceCount,
      },
      occupancy: {
        rate: occupancy.occupancyRate,
        occupiedUnits: occupancy.occupiedUnits,
        vacantUnits: occupancy.vacantUnits,
        totalUnits: occupancy.totalUnits,
      },
      pendingPayments: {
        count: pendingPayments.count,
        totalAmount: pendingPayments.totalAmount,
      },
      upcomingLeaseExpirations: {
        count: upcomingExpirations.length,
        leases: upcomingExpirations,
      },
    };
  }

  /**
   * Get tenants with overdue rent for the filtered list
   */
  async getTenantsWithOverdueRent() {
    const now = new Date();

    const tenantsWithOverdue = await db
      .select({
        tenant_id: tenants.id,
        tenant_name: tenants.fullName,
        tenant_email: tenants.email,
        tenant_phone: tenants.phone,
        totalOverdue: sql<string>`SUM(${rentPayments.amount})`,
        overdueCount: sql<number>`COUNT(${rentPayments.id})`,
        oldestDueDate: sql<Date>`MIN(${rentPayments.dueDate})`,
      })
      .from(rentPayments)
      .innerJoin(leases, eq(rentPayments.leaseId, leases.id))
      .innerJoin(tenants, eq(leases.tenantId, tenants.id))
      .where(
        and(eq(rentPayments.status, "overdue"), lte(rentPayments.dueDate, now))
      )
      .groupBy(tenants.id, tenants.fullName, tenants.email, tenants.phone)
      .orderBy(sql`MIN(${rentPayments.dueDate}) ASC`);

    return tenantsWithOverdue.map((tenant) => ({
      id: tenant.tenant_id,
      name: tenant.tenant_name,
      email: tenant.tenant_email,
      phone: tenant.tenant_phone,
      totalOverdue: tenant.totalOverdue,
      overdueCount: Number(tenant.overdueCount),
      oldestDueDate: tenant.oldestDueDate,
    }));
  }

  /**
   * Get overdue rent items for dashboard - detailed invoice-level view
   * Returns individual overdue invoices with calculated daysOverdue
   */
  async getOverdueRentItems() {
    const now = new Date();

    const overdueItems = await db
      .select({
        invoice_id: rentPayments.id,
        invoice_amount: rentPayments.amount,
        invoice_dueDate: rentPayments.dueDate,
        tenant_id: tenants.id,
        tenant_name: tenants.fullName,
        tenant_phone: tenants.phone,
        unit_id: propertyUnits.id,
        unit_name: propertyUnits.name,
        property_id: properties.id,
        property_name: properties.name,
        property_address: properties.address,
      })
      .from(rentPayments)
      .innerJoin(leases, eq(rentPayments.leaseId, leases.id))
      .innerJoin(tenants, eq(leases.tenantId, tenants.id))
      .innerJoin(propertyUnits, eq(leases.unitId, propertyUnits.id))
      .innerJoin(properties, eq(propertyUnits.propertyId, properties.id))
      .where(
        and(eq(rentPayments.status, "overdue"), lte(rentPayments.dueDate, now))
      )
      .orderBy(sql`${rentPayments.dueDate} ASC`);

    return overdueItems.map((item) => ({
      id: item.invoice_id,
      tenantName: item.tenant_name,
      unitInfo: `${item.unit_name}, ${item.property_name}`,
      amount: item.invoice_amount,
      dueDate: item.invoice_dueDate.toISOString(),
      daysOverdue: this.calculateDaysDifference(
        now,
        new Date(item.invoice_dueDate)
      ),
      phoneNumber: item.tenant_phone,
    }));
  }

  /**
   * Get vacant units for property list
   */
  async getVacantUnits() {
    const vacantUnits = await db
      .select({
        unit_id: propertyUnits.id,
        unit_name: propertyUnits.name,
        unit_type: propertyUnits.type,
        unit_rentAmount: propertyUnits.rentAmount,
        unit_bedrooms: propertyUnits.bedrooms,
        unit_bathrooms: propertyUnits.bathrooms,
        property_id: properties.id,
        property_name: properties.name,
        property_address: properties.address,
      })
      .from(propertyUnits)
      .innerJoin(properties, eq(propertyUnits.propertyId, properties.id))
      .where(eq(propertyUnits.status, "vacant"))
      .orderBy(sql`${propertyUnits.createdAt} DESC`);

    return vacantUnits.map((unit) => ({
      id: unit.unit_id,
      name: unit.unit_name,
      type: unit.unit_type,
      rentAmount: unit.unit_rentAmount,
      bedrooms: unit.unit_bedrooms,
      bathrooms: unit.unit_bathrooms,
      property: {
        id: unit.property_id,
        name: unit.property_name,
        address: unit.property_address,
      },
    }));
  }

  /**
   * Get pending payment details (payments awaiting confirmation)
   * For dashboard widget - returns top 7 most recent
   */
  async getPendingPaymentDetails(limit?: number) {
    const query = db
      .select({
        invoice_id: rentPayments.id,
        invoice_amount: rentPayments.amount,
        invoice_dueDate: rentPayments.dueDate,
        invoice_paymentDate: rentPayments.paymentDate,
        invoice_note: rentPayments.note,
        tenant_id: tenants.id,
        tenant_name: tenants.fullName,
        tenant_phone: tenants.phone,
        unit_name: propertyUnits.name,
        property_name: properties.name,
      })
      .from(rentPayments)
      .innerJoin(leases, eq(rentPayments.leaseId, leases.id))
      .innerJoin(tenants, eq(leases.tenantId, tenants.id))
      .innerJoin(propertyUnits, eq(leases.unitId, propertyUnits.id))
      .innerJoin(properties, eq(propertyUnits.propertyId, properties.id))
      .where(
        and(
          eq(rentPayments.status, "pending"),
          sql`${rentPayments.paymentDate} IS NOT NULL`
        )
      )
      .orderBy(sql`${rentPayments.paymentDate} DESC`);

    const pendingPayments = limit ? await query.limit(limit) : await query;

    return pendingPayments.map((payment) => ({
      id: payment.invoice_id,
      amount: payment.invoice_amount,
      dueDate: payment.invoice_dueDate.toISOString(),
      paymentDate: payment.invoice_paymentDate?.toISOString() || "",
      tenantId: payment.tenant_id,
      tenantName: payment.tenant_name,
      tenantPhone: payment.tenant_phone,
      propertyUnit: `${payment.property_name}, ${payment.unit_name}`,
      note: payment.invoice_note,
    }));
  }

  /**
   * Get pending payments for dashboard widget (top 7)
   */
  async getPendingPaymentsWidget() {
    return this.getPendingPaymentDetails(7);
  }

  /**
   * Get all pending payments for full page
   */
  async getAllPendingPayments() {
    return this.getPendingPaymentDetails();
  }
}

export default new DashboardService();
