import { BaseService } from "./baseService";
import {
  Owner,
  CreateOwnerData,
  UpdateOwnerData,
  GetAllOwnersResponse,
} from "~/types/tenant";

class OwnerService extends BaseService {
  constructor() {
    super("owners");
  }

  /**
   * Get all owners
   */
  async getAllOwners(params?: {
    search?: string;
    limit?: number;
  }): Promise<GetAllOwnersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    const queryString = queryParams.toString();
    return this.get<GetAllOwnersResponse>(
      queryString ? `/?${queryString}` : "/"
    );
  }

  /**
   * Get a single owner by ID
   */
  async getOwnerById(id: string): Promise<Owner> {
    return this.get<Owner>(`/${id}`);
  }

  /**
   * Create a new owner
   */
  async createOwner(data: CreateOwnerData): Promise<Owner> {
    return this.post<Owner, CreateOwnerData>("/", data);
  }

  /**
   * Update an existing owner
   */
  async updateOwner(id: string, data: UpdateOwnerData): Promise<Owner> {
    return this.put<Owner, UpdateOwnerData>(`/${id}`, data);
  }

  /**
   * Delete an owner by ID
   */
  async deleteOwner(id: string): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`/${id}`);
  }
}

export const ownerService = new OwnerService();
