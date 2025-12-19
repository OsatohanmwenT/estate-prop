import {
  CreateLeaseData,
  CreateLeaseResponse,
  Lease,
  LeaseQueryParams,
  LeaseStatistics,
  LeaseWithDetails,
  RenewLeaseData,
  TerminateLeaseData,
  UpdateLeaseData,
} from "~/types/lease";
import { BaseService } from "./baseService";

class LeaseService extends BaseService {
  constructor() {
    super("leases");
  }

  /**
   * Get all leases with optional filters
   */
  async getAllLeases(params?: LeaseQueryParams): Promise<LeaseWithDetails[]> {
    const queryParams = new URLSearchParams();

    if (params?.status) queryParams.append("status", params.status);
    if (params?.tenantId) queryParams.append("tenantId", params.tenantId);
    if (params?.unitId) queryParams.append("unitId", params.unitId);
    if (params?.propertyId) queryParams.append("propertyId", params.propertyId);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const url = queryParams.toString() ? `/?${queryParams.toString()}` : "/";
    return this.get<LeaseWithDetails[]>(url);
  }

  async getLeaseById(leaseId: string): Promise<LeaseWithDetails> {
    return this.get<LeaseWithDetails>(`/${leaseId}`);
  }

  async createLease(data: CreateLeaseData): Promise<CreateLeaseResponse> {
    return this.post<CreateLeaseResponse, CreateLeaseData>("/", data);
  }

  async updateLease(leaseId: string, data: UpdateLeaseData): Promise<Lease> {
    return this.put<Lease, UpdateLeaseData>(`/${leaseId}`, data);
  }

  async terminateLease(
    leaseId: string,
    data: TerminateLeaseData
  ): Promise<Lease> {
    return this.patch<Lease, TerminateLeaseData>(`/${leaseId}/terminate`, data);
  }

  async renewLease(leaseId: string, data: RenewLeaseData): Promise<Lease> {
    return this.post<Lease, RenewLeaseData>(`/${leaseId}/renew`, data);
  }

  async getLeasesByTenant(tenantId: string): Promise<LeaseWithDetails[]> {
    return this.get<LeaseWithDetails[]>(`/tenant/${tenantId}`);
  }

  async getLeaseByUnit(unitId: string): Promise<LeaseWithDetails | null> {
    return this.get<LeaseWithDetails | null>(`/unit/${unitId}`);
  }

  async getLeaseStatistics(): Promise<LeaseStatistics> {
    return this.get<LeaseStatistics>("/stats");
  }

  async getExpiringLeases(days: number = 30): Promise<LeaseWithDetails[]> {
    return this.get<LeaseWithDetails[]>(`/expiring?days=${days}`);
  }

  async uploadAgreement(leaseId: string, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);
    return this.post<{ url: string }, FormData>(
      `/${leaseId}/upload-agreement`,
      formData
    );
  }
}

export const leaseService = new LeaseService();
