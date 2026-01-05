import { Owner } from "./owner";

export interface TableProperty {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  lga?: string | null;
  category: "residential" | "commercial" | "industrial" | "mixed_use";
  thumbnailImage?: string | null;
  ownerId: string;
  owner?: Owner;
  totalUnits: number;
  unitCount: number;
  occupiedUnits: number;
  vacantUnits: number;
  status: "vacant" | "occupied";
  occupancyRate: number;
  amenities?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  images: string[];
  state: string;
  lga?: string | null;
  category: "residential" | "commercial" | "industrial" | "mixed_use";
  thumbnailImage?: string | null;
  ownerId: string;
  owner?: Owner;
  totalUnits: number;
  unitCount: number;
  occupiedUnits: number;
  vacantUnits: number;
  status: "vacant" | "occupied";
  occupancyRate: number;
  totalRevenue: string;
  amenities?: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyData {
  name: string;
  address: string;
  city: string;
  state: string;
  images?: string[];
  lga?: string;
  category: "residential" | "commercial" | "industrial" | "mixed_use";
  amenities?: string[];
  ownerId: string;
  organizationId: string;
  description?: string;
}

export interface UpdatePropertyData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  lga?: string;
  category?: "residential" | "commercial" | "industrial" | "mixed_use";
  amenities?: string[];
  ownerId?: string;
  description?: string;
  images?: string[];
}

export interface GetPropertiesParams {
  limit?: number;
  page?: number;
  search?: string;
  city?: string;
  state?: string;
  category?: string;
  ownerId?: string;
}

export interface PropertiesResponse {
  success: boolean;
  message: string;
  data: Property[];
  pagination: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface Unit {
  id: string;
  code: string;
  type: string;
  propertyId?: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  unitSize: number;
  status: "vacant" | "occupied";
  condition?: "good" | "fair" | "poor" | "renovation_needed" | null;
  rentAmount: string;
  property?: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
  };
  tenant?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt?: string;
}
