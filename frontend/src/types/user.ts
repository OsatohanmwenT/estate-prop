export type User = {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  phone?: string;
  address?: string;
  systemRole: "admin" | "user";
  role?: "admin" | "manager" | "surveyor" | "owner";
  organizationId?: string | null;
  organizationName?: string | null;
  organizationSlug?: string | null;
};

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  systemRole: "admin" | "user";
  role?: "admin" | "manager" | "surveyor" | "owner";
  phone?: string;
  address?: string;
  organizationId?: string | null;
  organizationName?: string | null;
  organizationSlug?: string | null;
};
