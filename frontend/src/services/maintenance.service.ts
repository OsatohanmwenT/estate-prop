/**
 * Maintenance Service
 * API calls for maintenance management
 */

import type {
  CreateMaintenanceRequest,
  MaintenanceByProperty,
  MaintenanceByUnit,
  MaintenanceLog,
  MaintenanceReminder,
  MaintenanceRequest,
  MaintenanceRequestWithDetails,
  MaintenanceStatistics,
  UpdateMaintenanceRequest,
} from "~/types/maintenance";
import { BaseService } from "./baseService";

class MaintenanceService extends BaseService {
  constructor() {
    super("maintenance");
  }

  /**
   * Get all maintenance requests
   */
  async getAllMaintenanceRequests(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    priority?: string;
    type?: string;
    propertyId?: string;
    unitId?: string;
  }): Promise<MaintenanceRequest[]> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.priority) queryParams.append("priority", params.priority);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.propertyId) queryParams.append("propertyId", params.propertyId);
    if (params?.unitId) queryParams.append("unitId", params.unitId);

    const url = queryParams.toString() ? `/?${queryParams.toString()}` : "/";
    return this.get<MaintenanceRequest[]>(url);
  }

  /**
   * Get a single maintenance request with full details
   */
  async getMaintenanceById(id: string): Promise<MaintenanceRequestWithDetails> {
    return this.get<MaintenanceRequestWithDetails>(`/${id}`);
  }

  /**
   * Create a new maintenance request
   */
  async createMaintenance(
    data: CreateMaintenanceRequest
  ): Promise<MaintenanceRequest> {
    return this.post<MaintenanceRequest, CreateMaintenanceRequest>("/", data);
  }

  /**
   * Update a maintenance request
   */
  async updateMaintenance(
    id: string,
    data: UpdateMaintenanceRequest
  ): Promise<MaintenanceRequest> {
    return this.patch<MaintenanceRequest, UpdateMaintenanceRequest>(
      `/${id}`,
      data
    );
  }

  /**
   * Delete a maintenance request
   */
  async deleteMaintenance(id: string): Promise<void> {
    return this.delete<void>(`/${id}`);
  }

  /**
   * Get maintenance statistics
   */
  async getStatistics(): Promise<MaintenanceStatistics> {
    return this.get<MaintenanceStatistics>("/statistics");
  }

  /**
   * Get maintenance history for a property
   */
  async getByProperty(propertyId: string): Promise<MaintenanceByProperty> {
    return this.get<MaintenanceByProperty>(`/property/${propertyId}`);
  }

  /**
   * Get maintenance history for a unit
   */
  async getByUnit(unitId: string): Promise<MaintenanceByUnit> {
    return this.get<MaintenanceByUnit>(`/unit/${unitId}`);
  }

  /**
   * Add a comment to a maintenance request
   */
  async addComment(id: string, comment: string): Promise<void> {
    return this.post<void, { comment: string }>(`/${id}/comments`, {
      comment,
    });
  }

  /**
   * Get logs for a maintenance request
   */
  async getLogs(id: string): Promise<MaintenanceLog[]> {
    return this.get<MaintenanceLog[]>(`/${id}/logs`);
  }

  /**
   * Add a receipt to a maintenance request
   */
  async addReceipt(id: string, receiptUrl: string): Promise<void> {
    return this.post<void, { receiptUrl: string }>(`/${id}/receipt`, {
      receiptUrl,
    });
  }

  /**
   * Get pending reminders
   */
  async getPendingReminders(): Promise<MaintenanceReminder[]> {
    return this.get<MaintenanceReminder[]>("/reminders/pending");
  }

  /**
   * Mark reminder as sent
   */
  async markReminderSent(id: string): Promise<void> {
    return this.post<void, {}>(`/${id}/reminder/send`, {});
  }
}

export const maintenanceService = new MaintenanceService();
