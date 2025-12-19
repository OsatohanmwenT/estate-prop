declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        fullName: string;
        email: string;
        phone?: string;
        systemRole: "admin" | "user";
        organizationId?: string | null;
        role?: "owner" | "manager" | "surveyor" | "agent" | "staff" | null;
        organizationName?: string | null;
        organizationSlug?: string | null;
        createdAt: Date;
      };
    }
  }
}

export interface user {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  systemRole: "admin" | "user";
  organizationId?: string | null;
  role?: "owner" | "manager" | "surveyor" | "agent" | "staff" | null;
  organizationName?: string | null;
  organizationSlug?: string | null;
  createdAt: Date;
}
