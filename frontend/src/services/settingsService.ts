import { BaseService } from "./baseService";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  logoUrl?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrganizationData {
  name?: string;
  logoUrl?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface Member {
  id: string;
  userId: string;
  role: "owner" | "manager" | "surveyor" | "agent" | "staff";
  status: "active" | "invited" | "suspended";
  joinedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    imageUrl?: string;
  };
}

export interface InviteMemberData {
  email: string;
  role: string;
}

class SettingsService extends BaseService {
  constructor() {
    super("organizations");
  }

  async createOrganization(name: string): Promise<Organization> {
    const response = await this.post<
      { organization: Organization },
      { name: string }
    >("/", { name });
    return response.organization;
  }

  async getMyOrganization(): Promise<Organization | null> {
    const response = await this.get<{ organization: Organization | null }>(
      "/my-organization"
    );
    return response.organization;
  }

  async updateOrganization(
    orgId: string,
    data: UpdateOrganizationData
  ): Promise<Organization> {
    const response = await this.patch<
      { organization: Organization },
      UpdateOrganizationData
    >(`/${orgId}`, data);
    return response.organization;
  }

  async getMembers(orgId: string): Promise<Member[]> {
    const response = await this.get<{ members: Member[] }>(`/${orgId}/members`);
    return response.members;
  }

  async inviteMember(orgId: string, data: InviteMemberData): Promise<Member> {
    const response = await this.post<{ member: Member }, InviteMemberData>(
      `/${orgId}/members/invite`,
      data
    );
    return response.member;
  }

  async updateMemberRole(memberId: string, role: string): Promise<Member> {
    const response = await this.patch<{ member: Member }, { role: string }>(
      `/members/${memberId}`,
      { role }
    );
    return response.member;
  }

  async removeMember(memberId: string): Promise<void> {
    await this.delete(`/members/${memberId}`);
  }
}

export const settingsService = new SettingsService();
