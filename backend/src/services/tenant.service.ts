import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../database";
import {
  leases,
  properties,
  propertyUnits,
  tenants,
} from "../database/schemas";

class TenantService {
  async getAllTenants(
    limit: number,
    offset: number,
    search: string | null | undefined,
    organizationId: string
  ) {
    const conditions = [eq(tenants.organizationId, organizationId)];

    if (search) {
      conditions.push(
        or(
          ilike(tenants.fullName, `%${search}%`),
          ilike(tenants.email, `%${search}%`),
          ilike(tenants.phone, `%${search}%`)
        )!
      );
    }

    const allTenants = await db
      .select({
        id: tenants.id,
        fullName: tenants.fullName,
        email: tenants.email,
        phone: tenants.phone,
        nokName: tenants.nokName,
        nokPhone: tenants.nokPhone,
        createdAt: tenants.createdAt,
        propertyName: properties.name,
        propertyAddress: properties.address,
        unitType: propertyUnits.type,
        rentAmount: leases.rentAmount,
        status: leases.status,
        avatarUrl: sql<string | null>`null`,
      })
      .from(tenants)
      .leftJoin(
        leases,
        and(eq(tenants.id, leases.tenantId), eq(leases.status, "active"))
      )
      .leftJoin(propertyUnits, eq(leases.unitId, propertyUnits.id))
      .leftJoin(properties, eq(propertyUnits.propertyId, properties.id))
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(tenants.createdAt));

    console.log(allTenants);

    return allTenants;
  }

  async addTenant(tenantData: {
    fullName: string;
    email: string;
    phone: string;
    nokName?: string;
    nokPhone?: string;
    annualIncome?: number;
    metadata?: string;
    organizationId: string;
  }) {
    const newTenant = await db
      .insert(tenants)
      .values({
        fullName: tenantData.fullName,
        email: tenantData.email,
        phone: tenantData.phone,
        nokName: tenantData.nokName || null,
        nokPhone: tenantData.nokPhone || null,
        annualIncome: tenantData.annualIncome?.toString() || null,
        metadata: tenantData.metadata || null,
        organizationId: tenantData.organizationId,
      })
      .returning();

    return newTenant;
  }

  async updateTenant(
    tenantId: string,
    tenantData: {
      fullName?: string;
      email?: string;
      phone?: string;
      nokName?: string;
      nokPhone?: string;
      annualIncome?: number;
      metadata?: string;
    }
  ) {
    const dataToUpdate: Record<string, any> = { ...tenantData };
    if (tenantData.annualIncome !== undefined) {
      dataToUpdate.annualIncome = tenantData.annualIncome?.toString() || null;
    }

    const [updatedTenant] = await db
      .update(tenants)
      .set(dataToUpdate)
      .where(eq(tenants.id, tenantId))
      .returning();
    return updatedTenant || null;
  }

  async getTenantById(tenantId: string) {
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, tenantId))
      .limit(1);
    return tenant || null;
  }

  async deleteTenantById(tenantId: string) {
    const [deletedTenant] = await db
      .delete(tenants)
      .where(eq(tenants.id, tenantId))
      .returning();
    return deletedTenant || null;
  }

  async getTenantsCount(search?: string, organizationId?: string) {
    const conditions = [];

    if (organizationId) {
      conditions.push(eq(tenants.organizationId, organizationId));
    }

    if (search) {
      conditions.push(
        or(
          ilike(tenants.fullName, `%${search}%`),
          ilike(tenants.email, `%${search}%`),
          ilike(tenants.phone, `%${search}%`)
        )
      );
    }

    const [result] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(tenants)
      .where(conditions.length ? and(...conditions) : undefined);

    return result?.count || 0;
  }

  async checkTenantEmailExists(email: string, excludeId?: string) {
    const query = db
      .select({ id: tenants.id })
      .from(tenants)
      .where(eq(tenants.email, email))
      .limit(1);

    const [result] = await query;

    if (result && excludeId && result.id === excludeId) {
      return false;
    }

    return !!result;
  }
}

export const tenantService = new TenantService();
