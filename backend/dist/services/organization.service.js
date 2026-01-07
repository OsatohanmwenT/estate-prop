"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
const schemas_1 = require("../database/schemas");
class OrganizationService {
    async createOrganization(data) {
        const { name, userId } = data;
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") +
            "-" +
            Date.now().toString().slice(-4);
        return await database_1.db.transaction(async (tx) => {
            const [newOrg] = await tx
                .insert(schemas_1.organizations)
                .values({
                name,
                slug,
                ownerId: userId,
            })
                .returning({
                id: schemas_1.organizations.id,
                name: schemas_1.organizations.name,
                slug: schemas_1.organizations.slug,
                ownerId: schemas_1.organizations.ownerId,
                createdAt: schemas_1.organizations.createdAt,
            });
            await tx.insert(schemas_1.members).values({
                organizationId: newOrg.id,
                userId,
                role: "owner",
            });
            return newOrg;
        });
    }
    async getOrganizationByUserId(userId) {
        const [membership] = await database_1.db
            .select({
            id: schemas_1.organizations.id,
            name: schemas_1.organizations.name,
            slug: schemas_1.organizations.slug,
            ownerId: schemas_1.organizations.ownerId,
            createdAt: schemas_1.organizations.createdAt,
            role: schemas_1.members.role,
        })
            .from(schemas_1.members)
            .innerJoin(schemas_1.organizations, (0, drizzle_orm_1.eq)(schemas_1.members.organizationId, schemas_1.organizations.id))
            .where((0, drizzle_orm_1.eq)(schemas_1.members.userId, userId))
            .limit(1);
        return membership || null;
    }
    async updateOrganization(orgId, data) {
        const [updated] = await database_1.db
            .update(schemas_1.organizations)
            .set({
            ...data,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schemas_1.organizations.id, orgId))
            .returning();
        return updated;
    }
    async getMembers(orgId) {
        const memberList = await database_1.db
            .select({
            id: schemas_1.members.id,
            userId: schemas_1.members.userId,
            role: schemas_1.members.role,
            status: schemas_1.members.status,
            joinedAt: schemas_1.members.joinedAt,
            user: {
                id: schemas_1.users.id,
                fullName: schemas_1.users.fullName,
                email: schemas_1.users.email,
                imageUrl: schemas_1.users.imageUrl,
            },
        })
            .from(schemas_1.members)
            .innerJoin(schemas_1.users, (0, drizzle_orm_1.eq)(schemas_1.members.userId, schemas_1.users.id))
            .where((0, drizzle_orm_1.eq)(schemas_1.members.organizationId, orgId));
        return memberList;
    }
    async inviteMember(orgId, email, role, invitedBy) {
        const [existingUser] = await database_1.db
            .select()
            .from(schemas_1.users)
            .where((0, drizzle_orm_1.eq)(schemas_1.users.email, email))
            .limit(1);
        if (!existingUser) {
            throw new Error("User with this email does not exist");
        }
        const [existingMember] = await database_1.db
            .select()
            .from(schemas_1.members)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.members.organizationId, orgId), (0, drizzle_orm_1.eq)(schemas_1.members.userId, existingUser.id)))
            .limit(1);
        if (existingMember) {
            throw new Error("User is already a member of this organization");
        }
        const [newMember] = await database_1.db
            .insert(schemas_1.members)
            .values({
            organizationId: orgId,
            userId: existingUser.id,
            role: role,
            status: "invited",
            invitedBy,
            invitedAt: new Date(),
        })
            .returning();
        return newMember;
    }
    async updateMemberRole(memberId, role) {
        const [updated] = await database_1.db
            .update(schemas_1.members)
            .set({ role: role })
            .where((0, drizzle_orm_1.eq)(schemas_1.members.id, memberId))
            .returning();
        return updated;
    }
    async removeMember(memberId) {
        const [removed] = await database_1.db
            .delete(schemas_1.members)
            .where((0, drizzle_orm_1.eq)(schemas_1.members.id, memberId))
            .returning();
        return removed;
    }
}
exports.organizationService = new OrganizationService();
//# sourceMappingURL=organization.service.js.map