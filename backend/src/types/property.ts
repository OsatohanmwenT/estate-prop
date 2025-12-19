export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  lga?: string | null;
  category: "residential" | "commercial" | "industrial" | "mixed_use";
  amenities?: string[] | null;
  description?: string | null;
  ownerId: string;
  organizationId: string;
  totalUnits: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePropertyData {
  name: string;
  address: string;
  city: string;
  state: string;
  lga?: string;
  category: "residential" | "commercial" | "industrial" | "mixed_use";
  amenities?: string[];
  description?: string;
  ownerId: string;
  organizationId: string;
  images?: string[];
}

export interface UpdatePropertyData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  lga?: string;
  category?: "residential" | "commercial" | "industrial" | "mixed_use";
  amenities?: string[];
  description?: string;
  ownerId?: string;
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

export type UNIT_STATUS = "vacant" | "occupied";
