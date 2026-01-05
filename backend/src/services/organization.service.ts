import { eq, and } from "drizzle-orm";
import { db } from "../database";
import { members, organizations, users } from "../database/schemas";

export interface CreateOrganizationData {
  name: string;
  userId: string;
}

export interface UpdateOrganizationData {
  name?: string;
  logoUrl?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
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

  async updateOrganization(orgId: string, data: UpdateOrganizationData) {
    const [updated] = await db
      .update(organizations)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, orgId))
      .returning();

    return updated;
  }

  async getMembers(orgId: string) {
    const memberList = await db
      .select({
        id: members.id,
        userId: members.userId,
        role: members.role,
        status: members.status,
        joinedAt: members.joinedAt,
        user: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
          imageUrl: users.imageUrl,
        },
      })
      .from(members)
      .innerJoin(users, eq(members.userId, users.id))
      .where(eq(members.organizationId, orgId));

    return memberList;
  }

  async inviteMember(
    orgId: string,
    email: string,
    role: string,
    invitedBy: string
  ) {
    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!existingUser) {
      throw new Error("User with this email does not exist");
    }

    // Check if already a member
    const [existingMember] = await db
      .select()
      .from(members)
      .where(
        and(
          eq(members.organizationId, orgId),
          eq(members.userId, existingUser.id)
        )
      )
      .limit(1);

    if (existingMember) {
      throw new Error("User is already a member of this organization");
    }

    const [newMember] = await db
      .insert(members)
      .values({
        organizationId: orgId,
        userId: existingUser.id,
        role: role as any,
        status: "invited",
        invitedBy,
        invitedAt: new Date(),
      })
      .returning();

    return newMember;
  }

  async updateMemberRole(memberId: string, role: string) {
    const [updated] = await db
      .update(members)
      .set({ role: role as any })
      .where(eq(members.id, memberId))
      .returning();

    return updated;
  }

  async removeMember(memberId: string) {
    const [removed] = await db
      .delete(members)
      .where(eq(members.id, memberId))
      .returning();

    return removed;
  }
}

export const organizationService = new OrganizationService();
