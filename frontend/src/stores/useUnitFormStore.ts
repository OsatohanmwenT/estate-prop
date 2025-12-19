import { create } from "zustand";
import { CreateUnitData } from "~/types/unit";

export interface UnitFormData extends Omit<CreateUnitData, "rentAmount"> {
  rentAmount: string;
  images?: string[];
}

export interface UnitBatchTemplate {
  prefix: string;
  startNumber: number;
  count: number;
  type: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  unitSize: number;
  rentAmount: string;
  condition?: "good" | "fair" | "poor" | "renovation_needed";
}

interface UnitFormStore {
  unitData: UnitFormData;
  setUnitData: (data: Partial<UnitFormData>) => void;
  batchMode: boolean;
  resetForm: () => void;
  setBatchMode: (enabled: boolean) => void;
  batchTemplate: UnitBatchTemplate;
  setBatchTemplate: (template: Partial<UnitBatchTemplate>) => void;
  resetBatchTemplate: () => void;
  generatedUnits: UnitFormData[];
  setGeneratedUnits: (units: UnitFormData[]) => void;
  generateUnitsFromTemplate: () => void;
}

const initialUnitData: UnitFormData = {
  code: "",
  type: "",
  floor: 0,
  bedrooms: 1,
  bathrooms: 1,
  unitSize: 0,
  status: "vacant",
  condition: "good",
  rentAmount: "",
  images: [],
  description: "",
  amenities: [],
  managementFeePercentage: "",
  managementFeeFixed: "",
};

const initialBatchTemplate: UnitBatchTemplate = {
  prefix: "Unit",
  startNumber: 1,
  count: 1,
  type: "",
  floor: 0,
  bedrooms: 1,
  bathrooms: 1,
  unitSize: 0,
  rentAmount: "",
  condition: "good",
};

export const useUnitFormStore = create<UnitFormStore>((set, get) => ({
  // Single unit
  unitData: initialUnitData,
  setUnitData: (data) =>
    set((state) => ({
      unitData: { ...state.unitData, ...data },
    })),
  resetUnitData: () => set({ unitData: initialUnitData }),

  batchMode: false,
  setBatchMode: (enabled) => set({ batchMode: enabled }),
  batchTemplate: initialBatchTemplate,
  setBatchTemplate: (template) =>
    set((state) => ({
      batchTemplate: { ...state.batchTemplate, ...template },
    })),
  resetBatchTemplate: () => set({ batchTemplate: initialBatchTemplate }),
  resetForm: () =>
    set({
      unitData: initialUnitData,
      batchTemplate: initialBatchTemplate,
      generatedUnits: [],
    }),
  generatedUnits: [],
  setGeneratedUnits: (units) => set({ generatedUnits: units }),
  generateUnitsFromTemplate: () => {
    const { batchTemplate } = get();
    const units: UnitFormData[] = [];

    for (let i = 0; i < batchTemplate.count; i++) {
      const unitNumber = batchTemplate.startNumber + i;
      units.push({
        code: `${batchTemplate.prefix} ${unitNumber}`,
        type: batchTemplate.type,
        floor: batchTemplate.floor,
        bedrooms: batchTemplate.bedrooms,
        bathrooms: batchTemplate.bathrooms,
        unitSize: batchTemplate.unitSize,
        rentAmount: batchTemplate.rentAmount,
        status: "vacant",
        condition: batchTemplate.condition || "good",
        images: [],
        description: "",
        amenities: [],
        managementFeePercentage: "",
        managementFeeFixed: "",
      });
    }

    set({ generatedUnits: units });
  },
}));
