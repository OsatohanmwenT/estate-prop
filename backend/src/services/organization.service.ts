import { db } from "../database";
import { organizations, members } from "../database/schemas";
import { eq } from "drizzle-orm";

export interface CreateOrganizationData {
  name: string;
  userId: string;
}

class OrganizationService {
  async createOrganization(data: CreateOrganizationData) {
    const { name, userId } = data;

    // Generate unique slug
    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Date.now().toString().slice(-4);

    return await db.transaction(async (tx) => {
      const [newOrg] = await tx
        .insert(organizations)
        .values({
          name,
          slug,
          ownerId: userId,
        })
        .returning({
          id: organizations.id,
          name: organizations.name,
          slug: organizations.slug,
          ownerId: organizations.ownerId,
          createdAt: organizations.createdAt,
        });

      await tx.insert(members).values({
        organizationId: newOrg.id,
        userId,
        role: "owner",
      });

      return newOrg;
    });
  }

  async getOrganizationByUserId(userId: string) {
    const [membership] = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        ownerId: organizations.ownerId,
        createdAt: organizations.createdAt,
        role: members.role,
      })
      .from(members)
      .innerJoin(organizations, eq(members.organizationId, organizations.id))
      .where(eq(members.userId, userId))
      .limit(1);

    return membership || null;
  }
}

export const organizationService = new OrganizationService();
