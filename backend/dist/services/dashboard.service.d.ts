declare class DashboardService {
    private calculateDaysDifference;
    getOverdueRentSummary(): Promise<{
        totalAmount: string;
        tenantCount: number;
        invoiceCount: number;
    }>;
    getOccupancyRate(): Promise<{
        occupancyRate: number;
        occupiedUnits: number;
        vacantUnits: number;
        totalUnits: number;
    }>;
    getPendingPaymentsCount(): Promise<{
        count: number;
        totalAmount: string;
    }>;
    getUpcomingLeaseExpirations(daysAhead?: number): Promise<{
        leaseId: string;
        endDate: Date;
        rentAmount: string;
        tenant: {
            id: string;
            name: string;
            email: string | null;
            phone: string | null;
        };
        unit: {
            id: string;
            name: string;
        };
        property: {
            id: string;
            name: string;
            address: string;
        };
    }[]>;
    getUpcomingLeaseItems(daysAhead?: number): Promise<{
        id: string;
        tenantName: string;
        unitInfo: string;
        expiryDate: string;
        daysUntilExpiry: number;
        phoneNumber: string | null;
        email: string | null;
    }[]>;
    getDashboardSummary(): Promise<{
        overdueRent: {
            totalAmount: string;
            tenantCount: number;
            invoiceCount: number;
        };
        occupancy: {
            rate: number;
            occupiedUnits: number;
            vacantUnits: number;
            totalUnits: number;
        };
        pendingPayments: {
            count: number;
            totalAmount: string;
        };
        upcomingLeaseExpirations: {
            count: number;
            leases: {
                leaseId: string;
                endDate: Date;
                rentAmount: string;
                tenant: {
                    id: string;
                    name: string;
                    email: string | null;
                    phone: string | null;
                };
                unit: {
                    id: string;
                    name: string;
                };
                property: {
                    id: string;
                    name: string;
                    address: string;
                };
            }[];
        };
    }>;
    getTenantsWithOverdueRent(): Promise<{
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        totalOverdue: string;
        overdueCount: number;
        oldestDueDate: Date;
    }[]>;
    getOverdueRentItems(): Promise<{
        id: string;
        tenantName: string;
        unitInfo: string;
        amount: string;
        dueDate: string;
        daysOverdue: number;
        phoneNumber: string | null;
        email: string | null;
    }[]>;
    getVacantUnits(): Promise<{
        id: string;
        name: string;
        type: "apartment" | "studio" | "penthouse" | "duplex" | "shop" | "office" | "warehouse" | "townhouse";
        rentAmount: string;
        bedrooms: number;
        bathrooms: number;
        property: {
            id: string;
            name: string;
            address: string;
        };
    }[]>;
    getPendingPaymentDetails(limit?: number): Promise<{
        id: string;
        amount: string;
        dueDate: string;
        paymentDate: string;
        tenantId: string;
        tenantName: string;
        tenantPhone: string | null;
        propertyUnit: string;
        note: string;
    }[]>;
    getPendingPaymentsWidget(): Promise<{
        id: string;
        amount: string;
        dueDate: string;
        paymentDate: string;
        tenantId: string;
        tenantName: string;
        tenantPhone: string | null;
        propertyUnit: string;
        note: string;
    }[]>;
    getAllPendingPayments(): Promise<{
        id: string;
        amount: string;
        dueDate: string;
        paymentDate: string;
        tenantId: string;
        tenantName: string;
        tenantPhone: string | null;
        propertyUnit: string;
        note: string;
    }[]>;
    getRevenueProjections(): Promise<{
        month: string;
        secured: number;
        potential: number;
    }[]>;
}
declare const _default: DashboardService;
export default _default;
//# sourceMappingURL=dashboard.service.d.ts.map