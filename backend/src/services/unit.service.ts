import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../database";
import {
  leases,
  properties,
  propertyUnits,
  tenants,
} from "../database/schemas";

class UnitService {
  async getUnitsByPropertyId(
    propertyId: string,
    limit = 20,
    offset = 0,
    organizationId?: string
  ) {
    let query = db
      .select({
        id: propertyUnits.id,
        code: propertyUnits.code,
        description: propertyUnits.description,
        type: propertyUnits.type,
        propertyId: propertyUnits.propertyId,
        amenities: propertyUnits.amenities,
        floor: propertyUnits.floor,
        bedrooms: propertyUnits.bedrooms,
        bathrooms: propertyUnits.bathrooms,
        unitSize: propertyUnits.unitSize,
        status: propertyUnits.status,
        condition: propertyUnits.condition,
        rentAmount: propertyUnits.rentAmount,
        createdAt: propertyUnits.createdAt,
        updatedAt: propertyUnits.updatedAt,
        tenant: {
          id: tenants.id,
          fullName: tenants.fullName,
          email: tenants.email,
        },
      })
      .from(propertyUnits)
      .leftJoin(
        leases,
        and(eq(leases.unitId, propertyUnits.id), eq(leases.status, "active"))
      )
      .leftJoin(tenants, eq(tenants.id, leases.tenantId));

    // Add organizationId filter if provided
    if (organizationId) {
      query = query
        .innerJoin(properties, eq(properties.id, propertyUnits.propertyId))
        .where(
          and(
            eq(propertyUnits.propertyId, propertyId),
            eq(properties.organizationId, organizationId)
          )
        ) as any;
    } else {
      query = query.where(eq(propertyUnits.propertyId, propertyId)) as any;
    }

    const unitsList = await query
      .limit(limit)
      .offset(offset)
      .orderBy(desc(propertyUnits.createdAt));

    return unitsList.map((unit) => ({
      ...unit,
      tenant: unit.tenant && unit.tenant.id ? unit.tenant : null,
    }));
  }

  async createUnit(unitData: {
    propertyId: string;
    code: string;
    type:
      | "apartment"
      | "studio"
      | "penthouse"
      | "duplex"
      | "shop"
      | "office"
      | "warehouse"
      | "townhouse";
    rentAmount: string;
    floor: number;
    unitSize: number;
    bedrooms: number;
    condition: "good" | "fair" | "poor" | "renovation_needed";
    bathrooms: number;
    status: "vacant" | "occupied";
    description?: string;
    amenities?: string[];
    managementFeePercentage?: string;
    managementFeeFixed?: string;
  }) {
    const newUnit = await db
      .insert(propertyUnits)
      .values({
        propertyId: unitData.propertyId,
        code: unitData.code,
        type: unitData.type,
        rentAmount: unitData.rentAmount,
        floor: unitData.floor,
        condition: unitData.condition,
        unitSize: unitData.unitSize,
        bedrooms: unitData.bedrooms,
        bathrooms: unitData.bathrooms,
        status: unitData.status,
        description: unitData.description,
        amenities: unitData.amenities,
        managementFeePercentage: unitData.managementFeePercentage || "0.00",
        managementFeeFixed: unitData.managementFeeFixed || "0.00",
      })
      .returning();

    // Update property totalUnits count
    await this.updatePropertyUnitCount(unitData.propertyId);

    return newUnit;
  }

  async getUnitsByPropertyIdAndStatus(
    propertyId: string,
    status: "vacant" | "occupied",
    limit = 10,
    offset = 0,
    organizationId?: string
  ) {
    const conditions = [
      eq(propertyUnits.propertyId, propertyId),
      eq(propertyUnits.status, status),
    ];

    let query = db.select().from(propertyUnits);

    if (organizationId) {
      query = query
        .innerJoin(properties, eq(properties.id, propertyUnits.propertyId))
        .where(
          and(...conditions, eq(properties.organizationId, organizationId))
        ) as any;
    } else {
      query = query.where(and(...conditions)) as any;
    }

    const unitsList = await query
      .limit(limit)
      .offset(offset)
      .orderBy(desc(propertyUnits.createdAt));
    return unitsList;
  }

  async getUnitsCountByProperty(
    propertyId: string,
    status?: "vacant" | "occupied",
    organizationId?: string
  ) {
    const conditions = [eq(propertyUnits.propertyId, propertyId)];

    if (status) {
      conditions.push(eq(propertyUnits.status, status));
    }

    let query = db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(propertyUnits);

    if (organizationId) {
      query = query
        .innerJoin(properties, eq(properties.id, propertyUnits.propertyId))
        .where(
          and(...conditions, eq(properties.organizationId, organizationId))
        ) as any;
    } else {
      query = query.where(and(...conditions)) as any;
    }

    const [result] = await query;

    return result.count;
  }

  async getUnitStatsByProperty(propertyId: string) {
    const [stats] = await db
      .select({
        total: sql<number>`cast(count(*) as integer)`,
        vacant: sql<number>`cast(sum(case when status = 'vacant' then 1 else 0 end) as integer)`,
        occupied: sql<number>`cast(sum(case when status = 'occupied' then 1 else 0 end) as integer)`,
        avgRent: sql<number>`cast(avg(cast(rent_amount as decimal)) as decimal(12,2))`,
        totalSize: sql<number>`cast(sum(unit_size) as integer)`,
      })
      .from(propertyUnits)
      .where(eq(propertyUnits.propertyId, propertyId));

    return {
      totalUnits: stats.total || 0,
      vacantUnits: stats.vacant || 0,
      occupiedUnits: stats.occupied || 0,
      occupancyRate:
        stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0,
      averageRent: stats.avgRent || 0,
      totalSquareMeters: stats.totalSize || 0,
    };
  }

  async checkPropertyExists(propertyId: string) {
    const [result] = await db
      .select({ id: properties.id })
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);
    return !!result;
  }

  async findUnitByCodeAndProperty(unitCode: string, propertyId: string) {
    const [unit] = await db
      .select()
      .from(propertyUnits)
      .where(
        and(
          eq(propertyUnits.code, unitCode),
          eq(propertyUnits.propertyId, propertyId)
        )
      )
      .limit(1);
    return unit || null;
  }

  async getUnitById(unitId: string, propertyId: string) {
    const result = await db
      .select({
        id: propertyUnits.id,
        code: propertyUnits.code,
        description: propertyUnits.description,
        type: propertyUnits.type,
        propertyId: propertyUnits.propertyId,
        amenities: propertyUnits.amenities,
        floor: propertyUnits.floor,
        bedrooms: propertyUnits.bedrooms,
        bathrooms: propertyUnits.bathrooms,
        unitSize: propertyUnits.unitSize,
        status: propertyUnits.status,
        condition: propertyUnits.condition,
        rentAmount: propertyUnits.rentAmount,
        createdAt: propertyUnits.createdAt,
        updatedAt: propertyUnits.updatedAt,
        tenant: {
          id: tenants.id,
          fullName: tenants.fullName,
          email: tenants.email,
        },
      })
      .from(propertyUnits)
      .leftJoin(
        leases,
        and(eq(leases.unitId, propertyUnits.id), eq(leases.status, "active"))
      )
      .leftJoin(tenants, eq(tenants.id, leases.tenantId))
      .where(
        and(
          eq(propertyUnits.id, unitId),
          eq(propertyUnits.propertyId, propertyId)
        )
      )
      .limit(1);

    if (!result[0]) return null;

    return {
      ...result[0],
      tenant: result[0].tenant && result[0].tenant.id ? result[0].tenant : null,
    };
  }

  async updateUnit(
    unitId: string,
    propertyId: string,
    updateData: Partial<{
      code: string;
      type:
        | "apartment"
        | "studio"
        | "penthouse"
        | "duplex"
        | "shop"
        | "office"
        | "warehouse"
        | "townhouse";
      rentAmount: string;
      floor: number;
      unitSize: number;
      bedrooms: number;
      bathrooms: number;
      condition: "good" | "fair" | "poor" | "renovation_needed";
      status: "vacant" | "occupied";
      description: string;
      amenities: string[];
    }>
  ) {
    const [updatedUnit] = await db
      .update(propertyUnits)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(propertyUnits.id, unitId),
          eq(propertyUnits.propertyId, propertyId)
        )
      )
      .returning();
    return updatedUnit || null;
  }

  async deleteUnit(unitId: string, propertyId: string) {
    const [deletedUnit] = await db
      .delete(propertyUnits)
      .where(
        and(
          eq(propertyUnits.id, unitId),
          eq(propertyUnits.propertyId, propertyId)
        )
      )
      .returning();

    // Update property totalUnits count
    if (deletedUnit) {
      await this.updatePropertyUnitCount(propertyId);
    }

    return deletedUnit || null;
  }

  async updatePropertyUnitCount(propertyId: string) {
    // Get the actual count of units for this property
    const count = await this.getUnitsCountByProperty(propertyId);

    // Update the property's totalUnits field
    await db
      .update(properties)
      .set({ totalUnits: count })
      .where(eq(properties.id, propertyId));

    return count;
  }

  async getAllUnitsByOrganization(
    organizationId: string,
    limit = 20,
    offset = 0
  ) {
    const unitsList = await db
      .select({
        id: propertyUnits.id,
        code: propertyUnits.code,
        type: propertyUnits.type,
        floor: propertyUnits.floor,
        bedrooms: propertyUnits.bedrooms,
        bathrooms: propertyUnits.bathrooms,
        unitSize: propertyUnits.unitSize,
        status: propertyUnits.status,
        rentAmount: propertyUnits.rentAmount,
        condition: propertyUnits.condition,
        createdAt: propertyUnits.createdAt,
        property: {
          id: properties.id,
          name: properties.name,
          address: properties.address,
          city: properties.city,
          state: properties.state,
        },
      })
      .from(propertyUnits)
      .innerJoin(properties, eq(propertyUnits.propertyId, properties.id))
      .where(eq(properties.organizationId, organizationId))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(propertyUnits.createdAt));

    return unitsList;
  }

  async getAllUnitsCountByOrganization(organizationId: string) {
    const [result] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(propertyUnits)
      .innerJoin(properties, eq(propertyUnits.propertyId, properties.id))
      .where(eq(properties.organizationId, organizationId));

    return result.count;
  }
}

export const unitService = new UnitService();
