import { Unit } from "~/types/property";
import { BaseService } from "./baseService";

class UnitService extends BaseService {
  constructor() {
    super("units");
  }

  async getAllUnits(params?: { limit?: number; page?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    const url = queryParams.toString() ? `/?${queryParams.toString()}` : "/";
    return this.get<{ data: any[]; total: number }>(url);
  }

  async getUnitById(propertyId: string, unitId: string): Promise<Unit> {
    return this.get<Unit>(`/${propertyId}/unit/${unitId}`);
  }

  async updateUnit(propertyId: string, unitId: string, data: any) {
    return this.patch(`/${propertyId}/unit/${unitId}`, data);
  }

  async deleteUnit(propertyId: string, unitId: string) {
    return this.delete(`/${propertyId}/unit/${unitId}`);
  }

  async getUnitsByProperty(propertyId: string) {
    if (!propertyId) return { data: [], total: 0 };
    return this.get<{ data: Unit[]; total: number }>(
      `/?propertyId=${propertyId}&limit=100`
    );
  }
}

export const unitService = new UnitService();
