export interface DashboardSummary {
  occupancy: {
    occupiedUnits: number;
    vacantUnits: number;
    totalUnits: number;
    rate: number;
  };

  overdueRent: {
    tenantCount: number;
    invoiceCount: number;
    totalAmount: string;
  };

  pendingPayments: {
    count: number;
    totalAmount: string;
  };

  upcomingLeaseExpirations: {
    count: number;
  };
}

export interface OverdueRentItem {
  id: string;
  tenantName: string;
  unitInfo: string;
  amount: string;
  dueDate: string;
  daysOverdue: number;
  phoneNumber: string;
}

export interface UpcomingLeaseItem {
  id: string;
  tenantName: string;
  unitInfo: string;
  expiryDate: string;
  daysUntilExpiry: number;
  phoneNumber: string;
  email: string;
}

export interface PendingPaymentItem {
  id: string;
  amount: string;
  dueDate: string;
  paymentDate: string;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  propertyUnit: string;
  note: string | null;
}

export interface OccupancyStats {
  occupiedUnits: number;
  vacantUnits: number;
  totalUnits: number;
  rate: number;
}

export interface OverdueRentStats {
  tenantCount: number;
  invoiceCount: number;
  totalAmount: string;
}

export interface PendingPaymentsStats {
  count: number;
  totalAmount: string;
}

export interface LeaseExpiration {
  id: string;
  tenantName: string;
  unitNumber: string;
  expirationDate: string;
  [key: string]: any;
}

export interface UpcomingLeaseExpirationsStats {
  count: number;
  leases: LeaseExpiration[];
}

export interface DashboardStats {
  occupancy: OccupancyStats;
  overdueRent: OverdueRentStats;
  pendingPayments: PendingPaymentsStats;
  upcomingLeaseExpirations: UpcomingLeaseExpirationsStats;
}

export interface OverdueRentTenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOverdue: string;
  overdueCount: number;
  oldestDueDate: string;
}

export interface PendingPayment {
  id: string;
  amount: string;
  dueDate: string;
  status: "pending";
  isOverdue: boolean;
  paymentDate: string | null;
  note: string | null;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  propertyId: string;
  propertyUnit: string;
  propertyType: string;
  propertyAddress: string;
  unitId: string;
  unitType: string;
}
