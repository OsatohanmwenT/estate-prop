"use client";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { conditions, unitTypes } from "~/constants/unit";
import { useUnitFormStore } from "~/stores/useUnitFormStore";
import { ConditionType } from "~/types/unit";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { X } from "lucide-react";

export function SingleUnitForm() {
  const { unitData, setUnitData } = useUnitFormStore();
  const [amenityInput, setAmenityInput] = useState("");

  const addAmenity = () => {
    if (amenityInput.trim()) {
      const currentAmenities = unitData.amenities || [];
      setUnitData({ amenities: [...currentAmenities, amenityInput.trim()] });
      setAmenityInput("");
    }
  };

  const removeAmenity = (index: number) => {
    const currentAmenities = unitData.amenities || [];
    setUnitData({
      amenities: currentAmenities.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Basic Info */}
      <section>
        <div className="mb-6 border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
            Unit Specifications
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="code"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Unit Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              placeholder="e.g., Flat A1"
              value={unitData.code}
              onChange={(e) => setUnitData({ code: e.target.value })}
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 h-10 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="type"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Unit Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={unitData.type}
              onValueChange={(value) => setUnitData({ type: value })}
            >
              <SelectTrigger
                id="type"
                className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="border-slate-200">
                {unitTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Description */}
      <div className="space-y-2">
        <Label
          htmlFor="description"
          className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
        >
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Add any additional details about this unit..."
          value={unitData.description || ""}
          onChange={(e) => setUnitData({ description: e.target.value })}
          rows={3}
          className="bg-white border-slate-200 rounded-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-none text-sm"
        />
      </div>

      {/* Dimensions */}
      <section>
        <div className="mb-6 border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
            Dimensions & Layout
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="bedrooms"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Bedrooms
            </Label>
            <Input
              id="bedrooms"
              type="number"
              min="0"
              value={unitData.bedrooms}
              onChange={(e) =>
                setUnitData({ bedrooms: parseInt(e.target.value) || 0 })
              }
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="bathrooms"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Bathrooms
            </Label>
            <Input
              id="bathrooms"
              type="number"
              min="0"
              value={unitData.bathrooms}
              onChange={(e) =>
                setUnitData({ bathrooms: parseInt(e.target.value) || 0 })
              }
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="floor"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Floor
            </Label>
            <Input
              id="floor"
              type="number"
              min="0"
              value={unitData.floor}
              onChange={(e) =>
                setUnitData({ floor: parseInt(e.target.value) || 0 })
              }
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="unitSize"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Size (sqm) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="unitSize"
              type="number"
              min="1"
              placeholder="120"
              value={unitData.unitSize || ""}
              onChange={(e) =>
                setUnitData({ unitSize: parseInt(e.target.value) || 0 })
              }
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Financial */}
      <section>
        <div className="mb-6 border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
            Financials
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="rentAmount"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Rent (₦) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="rentAmount"
              type="text"
              placeholder="150000"
              value={unitData.rentAmount}
              onChange={(e) => setUnitData({ rentAmount: e.target.value })}
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="managementFeePercentage"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Mgmt Fee (%)
            </Label>
            <Input
              id="managementFeePercentage"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="10"
              value={unitData.managementFeePercentage || ""}
              onChange={(e) =>
                setUnitData({ managementFeePercentage: e.target.value })
              }
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="managementFeeFixed"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Mgmt Fee (₦)
            </Label>
            <Input
              id="managementFeeFixed"
              type="text"
              placeholder="50000"
              value={unitData.managementFeeFixed || ""}
              onChange={(e) =>
                setUnitData({ managementFeeFixed: e.target.value })
              }
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm font-mono"
            />
          </div>
        </div>
      </section>

      {/* Status & Condition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="status"
            className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
          >
            Status
          </Label>
          <Select
            value={unitData.status || "vacant"}
            onValueChange={(value: "vacant" | "occupied") =>
              setUnitData({ status: value })
            }
          >
            <SelectTrigger
              id="status"
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-slate-200">
              <SelectItem value="vacant">Vacant</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="condition"
            className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
          >
            Condition
          </Label>
          <Select
            value={unitData.condition || "good"}
            onValueChange={(value: ConditionType) =>
              setUnitData({ condition: value })
            }
          >
            <SelectTrigger
              id="condition"
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-slate-200">
              {conditions.map((condition) => (
                <SelectItem key={condition.value} value={condition.value}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-2">
        <Label
          htmlFor="amenities"
          className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
        >
          Unit Amenities
        </Label>
        <div className="flex gap-2">
          <Input
            id="amenities"
            placeholder="Add amenity (e.g., AC)"
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAmenity();
              }
            }}
            className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
          />
          <button
            type="button"
            onClick={addAmenity}
            className="px-6 rounded-sm bg-slate-900 text-white hover:bg-slate-800 uppercase tracking-widest text-xs font-semibold h-10"
          >
            Add
          </button>
        </div>
        {unitData.amenities && unitData.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {unitData.amenities.map((amenity, index) => (
              <Badge
                key={index}
                variant="outline"
                className="pl-3 pr-1 py-1 flex items-center gap-1 border-slate-200 text-slate-600 rounded-sm"
              >
                {amenity}
                <button
                  type="button"
                  onClick={() => removeAmenity(index)}
                  className="ml-1 hover:bg-slate-100 rounded-full p-0.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
