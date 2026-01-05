import { CreatePropertyData, UpdatePropertyData } from "../types/property";
declare class PropertyService {
    getAllProperties(options?: {
        search?: string;
        city?: string;
        state?: string;
        category?: string;
        ownerId?: string;
        organizationId?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        thumbnailImage: string | null;
        images: string[];
        status: string;
        occupancyRate: number;
        id: string;
        name: string;
        address: string;
        category: "residential" | "commercial" | "industrial" | "mixed_use";
        city: string;
        state: string;
        totalUnits: number;
        unitCount: number;
        occupiedUnits: number;
        vacantUnits: number;
        totalRevenue: string;
    }[]>;
    createProperty(propertyData: CreatePropertyData): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        ownerId: string;
        updatedAt: Date;
        organizationId: string;
        description: string | null;
        category: "residential" | "commercial" | "industrial" | "mixed_use";
        amenities: string[] | null;
        address: string;
        lga: string | null;
        city: string;
        state: string;
        totalUnits: number;
    }>;
    getPropertyById(propertyId: string): Promise<{
        images: string[];
        id: string;
        name: string;
        category: "residential" | "commercial" | "industrial" | "mixed_use";
        address: string;
        lga: string | null;
        city: string;
        state: string;
        description: string | null;
        amenities: string[] | null;
        ownerId: string;
        organizationId: string;
        totalUnits: number;
        createdAt: Date;
        updatedAt: Date;
        owner: {
            id: string;
            fullName: string;
            email: string;
            phone: string;
        } | null;
    } | null>;
    updateProperty(propertyId: string, updateData: UpdatePropertyData): Promise<{
        id: string;
        organizationId: string;
        name: string;
        category: "residential" | "commercial" | "industrial" | "mixed_use";
        amenities: string[] | null;
        address: string;
        lga: string | null;
        city: string;
        state: string;
        ownerId: string;
        description: string | null;
        totalUnits: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteProperty(propertyId: string): Promise<{
        message: string;
    }>;
    getPropertiesCount(filters?: {
        city?: string;
        state?: string;
        category?: string;
        ownerId?: string;
        organizationId?: string;
    }): Promise<number>;
    getPropertiesByOwner(ownerId: string): Promise<{
        id: string;
        organizationId: string;
        name: string;
        category: "residential" | "commercial" | "industrial" | "mixed_use";
        amenities: string[] | null;
        address: string;
        lga: string | null;
        city: string;
        state: string;
        ownerId: string;
        description: string | null;
        totalUnits: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
export declare const propertyService: PropertyService;
export {};
//# sourceMappingURL=property.service.d.ts.map