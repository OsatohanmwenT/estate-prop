import { BaseService } from "./baseService";
import { CreateOrganizationData, Organization } from "~/types/organization";

class OrganizationService extends BaseService {
  constructor() {
    super("organizations");
  }

  async createOrganization(
    data: CreateOrganizationData
  ): Promise<{ organization: Organization }> {
    return this.post<{ organization: Organization }, CreateOrganizationData>(
      "/",
      data
    );
  }

  async getMyOrganization(): Promise<{ organization: Organization | null }> {
    return this.get<{ organization: Organization | null }>("/my-organization");
  }
}

export const organizationService = new OrganizationService();
