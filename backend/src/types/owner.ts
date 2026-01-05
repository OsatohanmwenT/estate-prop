export interface CreateOwnerData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  organizationId: string;
  managedBy?: string;
}

export interface UpdateOwnerData {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  managedBy?: string | null;
}
