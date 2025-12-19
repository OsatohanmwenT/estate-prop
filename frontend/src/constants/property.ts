import {
  Building,
  Car,
  Droplets,
  Dumbbell,
  Factory,
  Home,
  Shield,
  Thermometer,
  Tractor,
  Trees,
  Tv,
  Waves,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";


export interface PropertyTypeOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const AMENITIES_LIST = [
  { id: "wifi", label: "High Speed Wifi", icon: Wifi },
  { id: "parking", label: "Parking Space", icon: Car },
  { id: "water", label: "Running Water", icon: Droplets },
  { id: "power", label: "24/7 Power", icon: Zap },
  { id: "security", label: "Security", icon: Shield },
  { id: "gym", label: "Gym / Fitness", icon: Dumbbell },
  { id: "pool", label: "Swimming Pool", icon: Waves },
  { id: "garden", label: "Garden", icon: Trees },
  { id: "cable", label: "Cable TV", icon: Tv },
  { id: "ac", label: "Air Conditioning", icon: Thermometer },
];


export const PROPERTY_TYPES: PropertyTypeOption[] = [
  { id: "residential", label: "Residential", icon: Home },
  { id: "commercial", label: "Commercial", icon: Building },
  { id: "industrial", label: "Industrial", icon: Factory },
  { id: "agricultural", label: "Agricultural", icon: Tractor },
];

export const PROPERTY_SUB_TYPES: string[] = [
  "Bungalow",
  "Villa",
  "Apartment",
  "Townhouse",
  "Terraced",
  "Duplex",
  "Penthouse",
  "Block of Flats",
  "Office Building",
  "Shop",
  "Warehouse",
  "Land",
  "Other",
];

export const NIGERIAN_STATES: string[] = [
  "Lagos",
  "Abuja",
  "Rivers",
  "Kano",
  "Oyo",
  "Kaduna",
  "Enugu",
  "Anambra",
  "Delta",
  "Edo",
  "Imo",
  "Ogun",
  "Osun",
  "Kwara",
  "Other",
];
