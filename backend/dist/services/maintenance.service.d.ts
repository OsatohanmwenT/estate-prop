import type { CreateMaintenanceLogDTO, CreateMaintenanceRequestDTO, MaintenanceLogDTO, MaintenanceRequestFilters, UpdateMaintenanceRequestDTO } from "../types/maintenance";
declare class MaintenanceService {
    createMaintenanceRequest(data: CreateMaintenanceRequestDTO): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string;
        type: "plumbing" | "electrical" | "hvac" | "appliance" | "structural" | "cleaning" | "painting" | "landscaping" | "security" | "other";
        propertyId: string;
        status: "pending" | "in_progress" | "completed" | "cancelled";
        unitId: string | null;
        title: string;
        priority: "low" | "medium" | "high" | "urgent";
        reportedBy: string;
        assignedTo: string | null;
        estimatedCost: string | null;
        actualCost: string | null;
        scheduledDate: Date | null;
        completedAt: Date | null;
        vendorNotes: string | null;
        managerNotes: string | null;
        receipts: string[] | null;
        reminderDate: Date | null;
        reminderSent: Date | null;
    }>;
    updateMaintenanceRequest(id: string, userId: string, updates: UpdateMaintenanceRequestDTO): Promise<{
        id: string;
        organizationId: string;
        title: string;
        description: string;
        type: "plumbing" | "electrical" | "hvac" | "appliance" | "structural" | "cleaning" | "painting" | "landscaping" | "security" | "other";
        priority: "low" | "medium" | "high" | "urgent";
        status: "pending" | "in_progress" | "completed" | "cancelled";
        propertyId: string;
        unitId: string | null;
        reportedBy: string;
        assignedTo: string | null;
        estimatedCost: string | null;
        actualCost: string | null;
        scheduledDate: Date | null;
        completedAt: Date | null;
        vendorNotes: string | null;
        managerNotes: string | null;
        receipts: string[] | null;
        reminderDate: Date | null;
        reminderSent: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMaintenanceRequestById(id: string): Promise<{
        assignee: {
            id: string;
            fullName: string;
            email: string;
        } | null;
        logs: MaintenanceLogDTO[];
        id: string;
        organizationId: string;
        title: string;
        description: string;
        type: "plumbing" | "electrical" | "hvac" | "appliance" | "structural" | "cleaning" | "painting" | "landscaping" | "security" | "other";
        priority: "low" | "medium" | "high" | "urgent";
        status: "pending" | "in_progress" | "completed" | "cancelled";
        propertyId: string;
        unitId: string | null;
        reportedBy: string;
        assignedTo: string | null;
        estimatedCost: string | null;
        actualCost: string | null;
        scheduledDate: Date | null;
        completedAt: Date | null;
        vendorNotes: string | null;
        managerNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
        property: {
            id: string;
            name: string;
            address: string;
        } | null;
        unit: {
            id: string;
            unitNumber: string;
        } | null;
        reporter: {
            id: string;
            fullName: string;
            email: string;
        } | null;
    } | null>;
    getMaintenanceRequests(filters: MaintenanceRequestFilters): Promise<{
        id: string;
        title: string;
        description: string;
        type: "plumbing" | "electrical" | "hvac" | "appliance" | "structural" | "cleaning" | "painting" | "landscaping" | "security" | "other";
        priority: "low" | "medium" | "high" | "urgent";
        status: "pending" | "in_progress" | "completed" | "cancelled";
        propertyId: string;
        unitId: string | null;
        reportedBy: string;
        assignedTo: string | null;
        estimatedCost: string | null;
        actualCost: string | null;
        scheduledDate: Date | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        property: {
            name: string;
            address: string;
        } | null;
        unit: {
            unitNumber: string;
        } | null;
        reporter: {
            fullName: string;
            email: string;
        } | null;
    }[]>;
    createLog(data: CreateMaintenanceLogDTO): Promise<void>;
    addComment(maintenanceRequestId: string, userId: string, comment: string): Promise<boolean>;
    getLogsByRequestId(maintenanceRequestId: string): Promise<MaintenanceLogDTO[]>;
    deleteMaintenanceRequest(id: string, userId: string): Promise<boolean>;
    getStatistics(organizationId: string): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
        cancelled: number;
        totalCost: number;
    }>;
    getMaintenanceByProperty(propertyId: string, organizationId: string): Promise<{
        requests: {
            id: string;
            title: string;
            description: string;
            type: "plumbing" | "electrical" | "hvac" | "appliance" | "structural" | "cleaning" | "painting" | "landscaping" | "security" | "other";
            priority: "low" | "medium" | "high" | "urgent";
            status: "pending" | "in_progress" | "completed" | "cancelled";
            estimatedCost: string | null;
            actualCost: string | null;
            receipts: string[] | null;
            scheduledDate: Date | null;
            completedAt: Date | null;
            createdAt: Date;
            unit: {
                id: string;
                unitNumber: string;
            } | null;
        }[];
        totalSpent: number;
        count: number;
    }>;
    getMaintenanceByUnit(unitId: string, organizationId: string): Promise<{
        requests: {
            id: string;
            title: string;
            description: string;
            type: "plumbing" | "electrical" | "hvac" | "appliance" | "structural" | "cleaning" | "painting" | "landscaping" | "security" | "other";
            priority: "low" | "medium" | "high" | "urgent";
            status: "pending" | "in_progress" | "completed" | "cancelled";
            estimatedCost: string | null;
            actualCost: string | null;
            receipts: string[] | null;
            scheduledDate: Date | null;
            completedAt: Date | null;
            createdAt: Date;
        }[];
        totalSpent: number;
        count: number;
    }>;
    getMaintenanceNeedingReminders(organizationId: string): Promise<{
        id: string;
        title: string;
        status: "pending" | "in_progress" | "completed" | "cancelled";
        reminderDate: Date | null;
        reminderSent: Date | null;
        assignedTo: string | null;
        property: {
            name: string;
        } | null;
    }[]>;
    markReminderSent(maintenanceRequestId: string): Promise<boolean>;
    addReceipt(maintenanceRequestId: string, receiptUrl: string, userId: string): Promise<boolean>;
}
export declare const maintenanceService: MaintenanceService;
export {};
//# sourceMappingURL=maintenance.service.d.ts.map