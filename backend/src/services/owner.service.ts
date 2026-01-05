import { and, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../database";
import {
  invoices,
  leases,
  owners,
  properties,
  propertyUnits,
} from "../database/schemas";
import { CreateOwnerData, UpdateOwnerData } from "../types/owner";

class OwnerService {
  async createOwner(ownerData: CreateOwnerData) {
    const { fullName, email, phone, address, organizationId, managedBy } =
      ownerData;

    const existingOwner = await this.findOwnerByEmail(email);
    if (existingOwner) {
      throw new Error("Owner with this email already exists");
    }

    const [newOwner] = await db
      .insert(owners)
      .values({
        fullName,
        email,
        phone,
        address,
        organizationId,
        managedBy: managedBy || null,
      })
      .returning({
        id: owners.id,
        fullName: owners.fullName,
        email: owners.email,
        phone: owners.phone,
        address: owners.address,
        managedBy: owners.managedBy,
        createdAt: owners.createdAt,
      });

    return newOwner;
  }

  async findOwnerByEmail(email: string) {
    const [owner] = await db
      .select()
      .from(owners)
      .where(eq(owners.email, email))
      .limit(1);

    return owner || null;
  }

  async findOwnerById(id: string) {
    const [owner] = await db
      .select()
      .from(owners)
      .where(eq(owners.id, id))
      .limit(1);

    return owner || null;
  }

  /**
   * Get owner by ID with detailed statistics
   */
  async getOwnerWithDetails(id: string) {
    const [owner] = await db
      .select()
      .from(owners)
      .where(eq(owners.id, id))
      .limit(1);

    if (!owner) {
      return null;
    }

    const ownerProperties = await db
      .select({
        id: properties.id,
        name: properties.name,
        address: properties.address,
        city: properties.city,
        state: properties.state,
        category: properties.category,
        createdAt: properties.createdAt,
      })
      .from(properties)
      .where(eq(properties.ownerId, id));

    // Get property IDs for statistics
    const propertyIds = ownerProperties.map((p) => p.id);

    let totalUnits = 0;
    let totalRevenue = "0";
    let managementFeeTotal = "0";
    let ownerShareTotal = "0";

    if (propertyIds.length > 0) {
      // Get total units count
      const [unitsCount] = await db
        .select({
          count: sql<number>`cast(count(*) as integer)`,
        })
        .from(propertyUnits)
        .where(
          sql`${propertyUnits.propertyId} IN (${sql.raw(
            propertyIds.map((id) => `'${id}'`).join(",")
          )})`
        );

      totalUnits = unitsCount.count;

      // Get total revenue and breakdown from all properties via leases
      const [revenueResult] = await db
        .select({
          total: sql<string>`COALESCE(SUM(${invoices.amountPaid}), 0)::text`,
          managementFee: sql<string>`COALESCE(SUM(${invoices.managementFee}), 0)::text`,
          ownerShare: sql<string>`COALESCE(SUM(${invoices.ownerAmount}), 0)::text`,
        })
        .from(invoices)
        .innerJoin(leases, eq(invoices.leaseId, leases.id))
        .innerJoin(propertyUnits, eq(leases.unitId, propertyUnits.id))
        .where(
          sql`${propertyUnits.propertyId} IN (${sql.raw(
            propertyIds.map((id) => `'${id}'`).join(",")
          )})`
        );

      totalRevenue = revenueResult.total;
      managementFeeTotal = revenueResult.managementFee;
      ownerShareTotal = revenueResult.ownerShare;
    }

    return {
      ...owner,
      propertiesCount: ownerProperties.length,
      unitsCount: totalUnits,
      totalRevenue,
      managementFeeTotal,
      ownerShareTotal,
      properties: ownerProperties,
    };
  }

  async getAllOwners(options?: {
    search?: string;
    managedBy?: string;
    limit?: number;
    offset?: number;
  }) {
    const { search, managedBy, limit = 5, offset = 0 } = options || {};
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(owners.fullName, `%${search}%`),
          ilike(owners.email, `%${search}%`),
          ilike(owners.phone, `%${search}%`)
        )
      );
    }

    if (managedBy) {
      conditions.push(eq(owners.managedBy, managedBy));
    }

    if (conditions.length > 0) {
      return await db
        .select()
        .from(owners)
        .where(and(...conditions))
        .limit(limit)
        .offset(offset);
    }

    return await db.select().from(owners).limit(limit).offset(offset);
  }

  async updateOwner(id: string, updateData: UpdateOwnerData) {
    const existingOwner = await this.findOwnerById(id);
    if (!existingOwner) {
      throw new Error("Owner not found");
    }

    if (updateData.email && updateData.email !== existingOwner.email) {
      const ownerWithEmail = await this.findOwnerByEmail(updateData.email);
      if (ownerWithEmail) {
        throw new Error("Email already in use by another owner");
      }
    }

    const [updatedOwner] = await db
      .update(owners)
      .set({
        ...updateData,
        ...(updateData.managedBy !== undefined && {
          managedBy: updateData.managedBy,
        }),
      })
      .where(eq(owners.id, id))
      .returning({
        id: owners.id,
        fullName: owners.fullName,
        email: owners.email,
        phone: owners.phone,
        address: owners.address,
        managedBy: owners.managedBy,
        createdAt: owners.createdAt,
      });

    return updatedOwner;
  }

  /**
   * Delete an owner
   */
  async deleteOwner(id: string) {
    const existingOwner = await this.findOwnerById(id);
    if (!existingOwner) {
      throw new Error("Owner not found");
    }

    await db.delete(owners).where(eq(owners.id, id));

    return { message: "Owner deleted successfully" };
  }

  async getOwnersCount() {
    const [result] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(owners);
    return result.count;
  }
}

export const ownerService = new OwnerService();
