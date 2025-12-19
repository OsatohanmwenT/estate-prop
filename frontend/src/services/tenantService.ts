import {
  CreateTenantData,
  CreateTenantWithLeaseData,
  Tenant,
  TenantWithDetails,
  UpdateTenantData,
} from "~/types/tenant";
import { BaseService } from "./baseService";
import { leaseService } from "./leaseService";

class TenantService extends BaseService {
  constructor() {
    super("tenants");
  }

  /**
   * Get all tenants
   */
  async getAllTenants(params?: {
    limit?: number;
    page?: number;
    search?: string;
  }): Promise<TenantWithDetails[]> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.search) queryParams.append("search", params.search);

    const url = queryParams.toString() ? `/?${queryParams.toString()}` : "/";
    return this.get<TenantWithDetails[]>(url);
  }

  /**
   * Get a single tenant by ID
   */
  async getTenantById(id: string): Promise<Tenant> {
    return this.get<Tenant>(`/${id}`);
  }

  /**
   * Create a new tenant
   */
  async createTenant(data: CreateTenantData): Promise<Tenant> {
    return this.post<Tenant, CreateTenantData>("/", data);
  }

  /**
   * Create a new tenant with lease
   */
  async createTenantWithLease(
    data: CreateTenantWithLeaseData
  ): Promise<Tenant> {
    // 1. Create Tenant
    const tenantData: CreateTenantData = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      nokName: data.emergencyNo, // Mapping emergencyNo to nokName for now
      nokPhone: data.emergencyNo,
      metadata: JSON.stringify({
        occupation: data.occupation,
        currentAddress: data.currentAddress,
        guarantorName: data.guarantorName,
        allottedParking: data.allottedParking,
        accessCardNo: data.accessCardNo,
      }),
    };

    const tenant = await this.createTenant(tenantData);

    // 2. Create Lease
    if (tenant && tenant.id) {
      await leaseService.createLease({
        tenantId: tenant.id,
        unitId: data.unitId,
        startDate: data.startDate,
        endDate: data.endDate,
        rentAmount: data.rentAmount,
        billingCycle: data.paymentTerms,
        depositAmount: data.depositAmount,
      });
    }

    return tenant;
  }

  /**
   * Update an existing tenant
   */
  async updateTenant(id: string, data: UpdateTenantData): Promise<Tenant> {
    return this.put<Tenant, UpdateTenantData>(`/${id}`, data);
  }

  /**
   * Delete a tenant by ID
   */
  async deleteTenant(id: string): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`/${id}`);
  }
}

export const tenantService = new TenantService();
