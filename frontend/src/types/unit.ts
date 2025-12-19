export type ConditionType = "good" | "fair" | "poor" | "renovation_needed";

export interface Unit {
  id: string;
  propertyId: string;
  code: string;
  type: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  description?: string;
  amenities?: string[];
  unitSize: number;
  status: "vacant" | "occupied";
  condition?: ConditionType;
  rentAmount: string;
  images?: string[];
  tenant?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUnitData {
  code: string;
  type: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  description?: string;
  amenities?: string[];
  unitSize: number;
  status?: "vacant" | "occupied";
  condition?: ConditionType;
  rentAmount: string;
  managementFeePercentage?: string;
  managementFeeFixed?: string;
}

export interface UpdateUnitData {
  code?: string;
  type?: string;
  floor?: number;
  bedrooms?: number;
  bathrooms?: number;
  description?: string;
  amenities?: string[];
  unitSize?: number;
  status?: "vacant" | "occupied";
  condition?: "good" | "fair" | "poor" | "renovation_needed";
  rentAmount?: string;
  managementFeePercentage?: string;
  managementFeeFixed?: string;
}

export interface GetUnitsByPropertyParams {
  limit?: number;
  page?: number;
  status?: "vacant" | "occupied";
}
