import { CreateOwnerData, UpdateOwnerData } from "../types/owner";
declare class OwnerService {
    createOwner(ownerData: CreateOwnerData): Promise<{
        id: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        managedBy: string | null;
        createdAt: Date;
    }>;
    findOwnerByEmail(email: string): Promise<{
        id: string;
        organizationId: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        bankName: string | null;
        accountNumber: string | null;
        accountName: string | null;
        managedBy: string | null;
        deletedAt: Date | null;
        createdAt: Date;
    }>;
    findOwnerById(id: string): Promise<{
        id: string;
        organizationId: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        bankName: string | null;
        accountNumber: string | null;
        accountName: string | null;
        managedBy: string | null;
        deletedAt: Date | null;
        createdAt: Date;
    }>;
    getOwnerWithDetails(id: string): Promise<{
        propertiesCount: number;
        unitsCount: number;
        totalRevenue: string;
        managementFeeTotal: string;
        ownerShareTotal: string;
        properties: {
            id: string;
            name: string;
            address: string;
            city: string;
            state: string;
            category: "residential" | "commercial" | "industrial" | "mixed_use";
            createdAt: Date;
        }[];
        id: string;
        organizationId: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        bankName: string | null;
        accountNumber: string | null;
        accountName: string | null;
        managedBy: string | null;
        deletedAt: Date | null;
        createdAt: Date;
    } | null>;
    getAllOwners(options?: {
        search?: string;
        managedBy?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        id: string;
        organizationId: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        bankName: string | null;
        accountNumber: string | null;
        accountName: string | null;
        managedBy: string | null;
        deletedAt: Date | null;
        createdAt: Date;
    }[]>;
    updateOwner(id: string, updateData: UpdateOwnerData): Promise<{
        id: string;
        fullName: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        managedBy: string | null;
        createdAt: Date;
    }>;
    deleteOwner(id: string): Promise<{
        message: string;
    }>;
    getOwnersCount(): Promise<number>;
}
export declare const ownerService: OwnerService;
export {};
//# sourceMappingURL=owner.service.d.ts.map