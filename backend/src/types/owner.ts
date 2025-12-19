export interface CreateOwnerData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  organizationId: string;
  managedBy?: string;
}

export interface UpdateOwnerData {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  managedBy?: string | null;
}
