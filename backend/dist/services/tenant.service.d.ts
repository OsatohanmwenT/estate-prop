declare class TenantService {
    getAllTenants(limit: number, offset: number, search: string | null | undefined, organizationId: string): Promise<{
        id: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        nokName: string | null;
        nokPhone: string | null;
        createdAt: Date;
        propertyName: string | null;
        propertyAddress: string | null;
        unitType: "apartment" | "studio" | "penthouse" | "duplex" | "shop" | "office" | "warehouse" | "townhouse" | null;
        rentAmount: string | null;
        status: "draft" | "pending" | "active" | "terminated" | "expired" | null;
        avatarUrl: string | null;
    }[]>;
    addTenant(tenantData: {
        fullName: string;
        email: string;
        phone: string;
        nokName?: string;
        nokPhone?: string;
        annualIncome?: number;
        metadata?: string;
        organizationId: string;
    }): Promise<{
        id: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        organizationId: string;
        deletedAt: Date | null;
        nokName: string | null;
        nokPhone: string | null;
        annualIncome: string | null;
        metadata: string | null;
    }[]>;
    updateTenant(tenantId: string, tenantData: {
        fullName?: string;
        email?: string;
        phone?: string;
        nokName?: string;
        nokPhone?: string;
        annualIncome?: number;
        metadata?: string;
    }): Promise<{
        id: string;
        organizationId: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        nokName: string | null;
        nokPhone: string | null;
        annualIncome: string | null;
        metadata: string | null;
        deletedAt: Date | null;
        createdAt: Date;
    }>;
    getTenantById(tenantId: string): Promise<{
        id: string;
        organizationId: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        nokName: string | null;
        nokPhone: string | null;
        annualIncome: string | null;
        metadata: string | null;
        deletedAt: Date | null;
        createdAt: Date;
    }>;
    deleteTenantById(tenantId: string): Promise<{
        id: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        organizationId: string;
        deletedAt: Date | null;
        nokName: string | null;
        nokPhone: string | null;
        annualIncome: string | null;
        metadata: string | null;
    }>;
    getTenantsCount(search?: string, organizationId?: string): Promise<number>;
    checkTenantEmailExists(email: string, excludeId?: string): Promise<boolean>;
}
export declare const tenantService: TenantService;
export {};
//# sourceMappingURL=tenant.service.d.ts.map