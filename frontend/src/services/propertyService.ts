import { BaseService } from "./baseService";
import {
  Property,
  CreatePropertyData,
  UpdatePropertyData,
  GetPropertiesParams,
  PropertiesResponse,
  Unit,
} from "~/types/property";

class PropertyService extends BaseService {
  constructor() {
    super("properties");
  }

  /**
   * Get all properties with pagination and filters
   */
  async getAllProperties(
    params?: GetPropertiesParams
  ): Promise<PropertiesResponse> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.city) queryParams.append("city", params.city);
    if (params?.state) queryParams.append("state", params.state);
    if (params?.category) queryParams.append("category", params.category);
    if (params?.ownerId) queryParams.append("ownerId", params.ownerId);

    const url = queryParams.toString() ? `/?${queryParams.toString()}` : "/";
    return this.get<PropertiesResponse>(url);
  }

  /**
   * Get a single property by ID
   */
  async getPropertyById(id: string): Promise<Property> {
    return this.get<Property>(`/${id}`);
  }

  /**
   * Create a new property
   */
  async createProperty(data: CreatePropertyData): Promise<Property> {
    return this.post<Property, CreatePropertyData>("/", data);
  }

  /**
   * Update an existing property
   */
  async updateProperty(
    id: string,
    data: UpdatePropertyData
  ): Promise<Property> {
    return this.put<Property, UpdatePropertyData>(`/${id}`, data);
  }

  /**
   * Delete a property by ID
   */
  async deleteProperty(id: string): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`/${id}`);
  }

  /**
   * Get all units for a specific property
   */
  async getUnitsByProperty(propertyId: string): Promise<Unit[]> {
    return this.get<Unit[]>(`/${propertyId}/units`);
  }

  /**
   * Create a new unit for a property
   */
  async createUnit(
    propertyId: string,
    data: {
      name: string;
      type: string;
      floor: number;
      bedrooms: number;
      bathrooms: number;
      images?: string[];
      unitSize: number;
      condition?: "good" | "fair" | "poor" | "renovation_needed";
      rentAmount: number;
    }
  ): Promise<Unit> {
    return this.post<Unit, typeof data>(`/${propertyId}/units`, data);
  }
  /**
   * Create multiple units for a property
   */
  async createUnits(
    propertyId: string,
    units: {
      name: string;
      type: string;
      floor: number;
      bedrooms: number;
      bathrooms: number;
      images?: string[];
      unitSize: number;
      rentAmount: number;
    }[]
  ): Promise<Unit[]> {
    // Note: This assumes the backend supports batch creation at /:id/units/batch or similar
    // If not, we might need to loop here or update backend.
    // Based on unitService.ts, it seems we might need to use unitService.createUnits or loop.
    // Let's use unitService.createUnits logic but implemented here or call unitService.

    // Actually, let's just loop for now to be safe if backend batch endpoint isn't confirmed,
    // OR use the unitService.createUnits if we can import it.
    // But wait, I see unitService.ts has createUnits. Let's use that logic.

    const results = await Promise.all(
      units.map((unit) => this.createUnit(propertyId, unit))
    );
    return results;
  }
}

export const propertyService = new PropertyService();
