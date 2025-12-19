import { create } from "zustand";

export type PropertyFormStep = "address" | "amenities" | "gallery";

export interface PropertyFormData {
  // Address Details (core property info)
  propertyName: string;
  description?: string;
  state: string;
  city: string;
  area: string; // LGA
  street: string;

  // Property Type
  propertyType: string;
  propertySubType: string;

  // Gallery
  images: string[];

  // Owner
  ownerId: string;

  // Features & Amenities
  amenities: string[];

  // Unit Details (for unified creation)
  bedrooms: number;
  bathrooms: number;
  rentAmount: string;
  unitSize: number;
  unitName: string;

  // Multi-unit logic
  isMultiUnit: boolean;
  totalUnits: number;
}

export const initialFormData: PropertyFormData = {
  propertyName: "",
  description: "",
  state: "",
  city: "",
  area: "",
  street: "",
  propertyType: "",
  propertySubType: "",
  images: [],
  ownerId: "",
  amenities: [],
  bedrooms: 0,
  bathrooms: 0,
  rentAmount: "",
  unitSize: 0,
  unitName: "",
  isMultiUnit: false,
  totalUnits: 1,
};

interface PropertyFormStore {
  currentStep: PropertyFormStep;
  formData: PropertyFormData;
  isEditMode: boolean;
  propertyId: string | null;

  setStep: (step: PropertyFormStep) => void;
  setFormData: (
    data:
      | Partial<PropertyFormData>
      | ((prev: PropertyFormData) => Partial<PropertyFormData>)
  ) => void;
  resetForm: () => void;
  initializeForEdit: (id: string, data: Partial<PropertyFormData>) => void;
}

export const usePropertyFormStore = create<PropertyFormStore>((set) => ({
  currentStep: "address",
  formData: initialFormData,
  isEditMode: false,
  propertyId: null,

  setStep: (step) => set({ currentStep: step }),

  setFormData: (data) =>
    set((state) => {
      const newValues =
        typeof data === "function" ? data(state.formData) : data;
      return { formData: { ...state.formData, ...newValues } };
    }),

  resetForm: () =>
    set({
      currentStep: "address",
      formData: initialFormData,
      isEditMode: false,
      propertyId: null,
    }),

  initializeForEdit: (id, data) =>
    set({
      isEditMode: true,
      propertyId: id,
      formData: { ...initialFormData, ...data },
      currentStep: "address",
    }),
}));
