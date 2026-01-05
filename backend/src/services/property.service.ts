import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../database";
import { owners, properties, propertyImages } from "../database/schemas";
import { CreatePropertyData, UpdatePropertyData } from "../types/property";

class PropertyService {
  async getAllProperties(options?: {
    search?: string;
    city?: string;
    state?: string;
    category?: string;
    ownerId?: string;
    organizationId?: string;
    limit?: number;
    offset?: number;
  }) {
    const {
      search,
      city,
      state,
      category,
      ownerId,
      organizationId,
      limit = 15,
      offset = 0,
    } = options || {};

    const conditions = [];

    if (organizationId) {
      conditions.push(eq(properties.organizationId, organizationId));
    }

    if (search) {
      conditions.push(
        or(
          ilike(properties.name, `%${search}%`),
          ilike(properties.address, `%${search}%`),
          ilike(properties.city, `%${search}%`)
        )
      );
    }

    if (city) {
      conditions.push(ilike(properties.city, `%${city}%`));
    }
    if (state) {
      conditions.push(ilike(properties.state, `%${state}%`));
    }
    if (category) {
      conditions.push(eq(properties.category, category as any));
    }
    if (ownerId) {
      conditions.push(eq(properties.ownerId, ownerId));
    }

    const query = db
      .select({
        id: properties.id,
        name: properties.name,
        address: properties.address,
        category: properties.category,
        city: properties.city,
        state: properties.state,
        totalUnits: properties.totalUnits,
        unitCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM property_units 
          WHERE property_units.property_id = properties.id
        )`,
        occupiedUnits: sql<number>`(
          SELECT COUNT(*)::int 
          FROM property_units 
          WHERE property_units.property_id = properties.id
          AND property_units.status = 'occupied'
        )`,
        vacantUnits: sql<number>`(
          SELECT COUNT(*)::int 
          FROM property_units 
          WHERE property_units.property_id = properties.id
          AND property_units.status = 'vacant'
        )`,
        totalRevenue: sql<string>`(
          SELECT COALESCE(SUM(invoices.amount_paid), 0)::text
          FROM invoices
          INNER JOIN leases ON invoices.lease_id = leases.id
          INNER JOIN property_units ON leases.unit_id = property_units.id
          WHERE property_units.property_id = properties.id
        )`,
      })
      .from(properties);

    let result;
    if (conditions.length > 0) {
      result = await query
        .where(and(...conditions))
        .limit(limit)
        .offset(offset)
        .orderBy(desc(properties.createdAt));
    } else {
      result = await query
        .limit(limit)
        .offset(offset)
        .orderBy(desc(properties.createdAt));
    }

    // Fetch images for all properties
    const propertyIds = result.map((p) => p.id);

    let allImages: Array<{
      propertyId: string;
      imageUrl: string;
      isPrimary: boolean | null;
    }> = [];
    if (propertyIds.length > 0) {
      allImages = await db
        .select({
          propertyId: propertyImages.propertyId,
          imageUrl: propertyImages.imageUrl,
          isPrimary: propertyImages.isPrimary,
        })
        .from(propertyImages)
        .where(
          sql`${propertyImages.propertyId} IN ${sql.raw(
            `(${propertyIds.map((id) => `'${id}'`).join(",")})`
          )}`
        )
        .orderBy(propertyImages.isPrimary, propertyImages.createdAt);
    }

    // Map images to properties
    return result.map((property) => {
      const propertyImagesList = allImages.filter(
        (img) => img.propertyId === property.id
      );
      const thumbnailImage =
        propertyImagesList.find((img) => img.isPrimary)?.imageUrl ||
        propertyImagesList[0]?.imageUrl ||
        null;

      console.log(property);

      return {
        ...property,
        thumbnailImage,
        images: propertyImagesList.map((img) => img.imageUrl),
        status:
          property.unitCount === 0
            ? "vacant"
            : property.vacantUnits > 0
            ? "vacant"
            : "occupied",
        occupancyRate:
          property.unitCount > 0
            ? Math.round((property.occupiedUnits / property.unitCount) * 100)
            : 0,
      };
    });
  }

  async createProperty(propertyData: CreatePropertyData) {
    const [owner] = await db
      .select()
      .from(owners)
      .where(eq(owners.id, propertyData.ownerId))
      .limit(1);

    if (!owner) {
      throw new Error("Owner not found");
    }

    const { images, ...propertyWithoutImages } = propertyData;

    const [newProperty] = await db
      .insert(properties)
      .values({
        ...propertyWithoutImages,
        totalUnits: 0,
      })
      .returning();

    // If images are provided, insert them into property_images table
    if (images && images.length > 0) {
      const imageRecords = images.map((imageUrl, index) => ({
        propertyId: newProperty.id,
        imageUrl,
        isPrimary: index === 0, // First image is primary
      }));

      await db.insert(propertyImages).values(imageRecords);
    }

    return newProperty;
  }

  async getPropertyById(propertyId: string) {
    const [property] = await db
      .select({
        id: properties.id,
        name: properties.name,
        category: properties.category,
        address: properties.address,
        lga: properties.lga,
        city: properties.city,
        state: properties.state,
        description: properties.description,
        amenities: properties.amenities,
        ownerId: properties.ownerId,
        organizationId: properties.organizationId,
        totalUnits: properties.totalUnits,
        createdAt: properties.createdAt,
        updatedAt: properties.updatedAt,
        owner: {
          id: owners.id,
          fullName: owners.fullName,
          email: owners.email,
          phone: owners.phone,
        },
      })
      .from(properties)
      .leftJoin(owners, eq(properties.ownerId, owners.id))
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (!property) {
      return null;
    }

    // Fetch images separately
    const images = await db
      .select({
        imageUrl: propertyImages.imageUrl,
      })
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, propertyId));

    return {
      ...property,
      images: images.map((img) => img.imageUrl),
    };
  }

  async updateProperty(propertyId: string, updateData: UpdatePropertyData) {
    const existingProperty = await this.getPropertyById(propertyId);
    if (!existingProperty) {
      throw new Error("Property not found");
    }

    if (updateData.ownerId) {
      const [newOwner] = await db
        .select()
        .from(owners)
        .where(eq(owners.id, updateData.ownerId))
        .limit(1);

      if (!newOwner) {
        throw new Error("New owner not found");
      }
    }

    // Handle images update if provided
    if (updateData.images !== undefined) {
      // Delete existing images
      await db
        .delete(propertyImages)
        .where(eq(propertyImages.propertyId, propertyId));

      // Insert new images
      if (updateData.images.length > 0) {
        await db.insert(propertyImages).values(
          updateData.images.map((imageUrl, index) => ({
            propertyId,
            imageUrl,
            isPrimary: index === 0,
          }))
        );
      }
    }

    // Remove images from updateData as it's not a column in properties table
    const { images, ...propertyUpdateData } = updateData;

    const [updatedProperty] = await db
      .update(properties)
      .set({
        ...propertyUpdateData,
        updatedAt: new Date(),
      })
      .where(eq(properties.id, propertyId))
      .returning();

    return updatedProperty;
  }

  async deleteProperty(propertyId: string) {
    const existingProperty = await this.getPropertyById(propertyId);
    if (!existingProperty) {
      throw new Error("Property not found");
    }

    await db.delete(properties).where(eq(properties.id, propertyId));

    return { message: "Property deleted successfully" };
  }

  async getPropertiesCount(filters?: {
    city?: string;
    state?: string;
    category?: string;
    ownerId?: string;
    organizationId?: string;
  }) {
    const conditions = [];

    if (filters?.organizationId) {
      conditions.push(eq(properties.organizationId, filters.organizationId));
    }

    if (filters?.city) {
      conditions.push(ilike(properties.city, `%${filters.city}%`));
    }

    if (filters?.state) {
      conditions.push(ilike(properties.state, `%${filters.state}%`));
    }

    if (filters?.category) {
      conditions.push(eq(properties.category, filters.category as any));
    }

    if (filters?.ownerId) {
      conditions.push(eq(properties.ownerId, filters.ownerId));
    }

    if (conditions.length > 0) {
      const [result] = await db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(properties)
        .where(and(...conditions));
      return result.count;
    }

    const [result] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(properties);
    return result.count;
  }

  async getPropertiesByOwner(ownerId: string) {
    return await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, ownerId))
      .orderBy(sql`${properties.createdAt} DESC`);
  }
}

export const propertyService = new PropertyService();
