export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  role?: "owner" | "manager" | "surveyor" | "agent" | "staff";
}

export interface CreateOrganizationData {
  name: string;
}
