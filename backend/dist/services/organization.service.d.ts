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
declare class OrganizationService {
    createOrganization(data: CreateOrganizationData): Promise<{
        id: string;
        name: string;
        slug: string;
        ownerId: string;
        createdAt: Date;
    }>;
    getOrganizationByUserId(userId: string): Promise<{
        id: string;
        name: string;
        slug: string;
        ownerId: string;
        createdAt: Date;
        role: "owner" | "manager" | "surveyor" | "agent" | "staff";
    }>;
    updateOrganization(orgId: string, data: UpdateOrganizationData): Promise<{
        id: string;
        name: string;
        slug: string;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMembers(orgId: string): Promise<{
        id: string;
        userId: string;
        role: "owner" | "manager" | "surveyor" | "agent" | "staff";
        status: "active" | "invited" | "suspended";
        joinedAt: Date;
        user: {
            id: string;
            fullName: string;
            email: string;
            imageUrl: string | null;
        };
    }[]>;
    inviteMember(orgId: string, email: string, role: string, invitedBy: string): Promise<{
        id: string;
        organizationId: string;
        status: "active" | "invited" | "suspended";
        userId: string;
        role: "owner" | "manager" | "surveyor" | "agent" | "staff";
        joinedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
    }>;
    updateMemberRole(memberId: string, role: string): Promise<{
        id: string;
        organizationId: string;
        userId: string;
        role: "owner" | "manager" | "surveyor" | "agent" | "staff";
        joinedAt: Date;
        status: "active" | "invited" | "suspended";
        invitedBy: string | null;
        invitedAt: Date | null;
    }>;
    removeMember(memberId: string): Promise<{
        id: string;
        organizationId: string;
        status: "active" | "invited" | "suspended";
        userId: string;
        role: "owner" | "manager" | "surveyor" | "agent" | "staff";
        joinedAt: Date;
        invitedBy: string | null;
        invitedAt: Date | null;
    }>;
}
export declare const organizationService: OrganizationService;
export {};
//# sourceMappingURL=organization.service.d.ts.map