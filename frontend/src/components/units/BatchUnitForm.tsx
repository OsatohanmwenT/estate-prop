"use client";

import { useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { useUnitFormStore } from "~/stores/useUnitFormStore";
import { Card } from "~/components/ui/card";
import { Wand2, Trash2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { conditions, unitTypes } from "~/constants/unit";

export function BatchUnitForm() {
  const {
    batchTemplate,
    setBatchTemplate,
    generatedUnits,
    generateUnitsFromTemplate,
    setGeneratedUnits,
  } = useUnitFormStore();

  useEffect(() => {
    if (
      batchTemplate.count > 0 &&
      batchTemplate.type &&
      batchTemplate.rentAmount
    ) {
      generateUnitsFromTemplate();
    }
  }, [batchTemplate, generateUnitsFromTemplate]);

  const removeUnit = (index: number) => {
    setGeneratedUnits(generatedUnits.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Template Configuration */}
      <section>
        <div className="mb-6 border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
            Batch Configuration
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Define the pattern for generating multiple units
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <Label
              htmlFor="prefix"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Unit Name Prefix <span className="text-red-500">*</span>
            </Label>
            <Input
              id="prefix"
              placeholder="e.g., Flat"
              value={batchTemplate.prefix}
              onChange={(e) => setBatchTemplate({ prefix: e.target.value })}
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="startNumber"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Start Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="startNumber"
              type="number"
              min="1"
              value={batchTemplate.startNumber}
              onChange={(e) =>
                setBatchTemplate({
                  startNumber: parseInt(e.target.value) || 1,
                })
              }
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="count"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Number of Units <span className="text-red-500">*</span>
            </Label>
            <Input
              id="count"
              type="number"
              min="1"
              max="100"
              value={batchTemplate.count}
              onChange={(e) =>
                setBatchTemplate({ count: parseInt(e.target.value) || 1 })
              }
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <Label
              htmlFor="batch-type"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Unit Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={batchTemplate.type}
              onValueChange={(value) => setBatchTemplate({ type: value })}
            >
              <SelectTrigger
                id="batch-type"
                className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
              >
                <SelectValue placeholder="Select unit type" />
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

          <div className="space-y-2">
            <Label
              htmlFor="batch-floor"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Starting Floor
            </Label>
            <Input
              id="batch-floor"
              type="number"
              min="0"
              value={batchTemplate.floor}
              onChange={(e) =>
                setBatchTemplate({ floor: parseInt(e.target.value) || 0 })
              }
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <Label
              htmlFor="batch-bedrooms"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Bedrooms
            </Label>
            <Input
              id="batch-bedrooms"
              type="number"
              min="0"
              value={batchTemplate.bedrooms}
              onChange={(e) =>
                setBatchTemplate({ bedrooms: parseInt(e.target.value) || 0 })
              }
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="batch-bathrooms"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Bathrooms
            </Label>
            <Input
              id="batch-bathrooms"
              type="number"
              min="0"
              value={batchTemplate.bathrooms}
              onChange={(e) =>
                setBatchTemplate({ bathrooms: parseInt(e.target.value) || 0 })
              }
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="batch-unitSize"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Size (sqm) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="batch-unitSize"
              type="number"
              min="1"
              value={batchTemplate.unitSize || ""}
              onChange={(e) =>
                setBatchTemplate({ unitSize: parseInt(e.target.value) || 0 })
              }
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="batch-rentAmount"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Rent (₦) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="batch-rentAmount"
              type="text"
              placeholder="150000"
              value={batchTemplate.rentAmount}
              onChange={(e) => setBatchTemplate({ rentAmount: e.target.value })}
              className="bg-white border-slate-200 rounded-sm focus:border-slate-900 h-10 text-sm font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="batch-condition"
              className="text-xs uppercase tracking-wider text-slate-500 font-semibold"
            >
              Condition
            </Label>
            <Select
              value={batchTemplate.condition || "good"}
              onValueChange={(value: any) =>
                setBatchTemplate({ condition: value })
              }
            >
              <SelectTrigger
                id="batch-condition"
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
      </section>

      {/* Generated Units Preview */}
      {generatedUnits.length > 0 && (
        <section className="bg-slate-50 rounded-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Preview Generated Units
            </h4>
            <Badge
              variant="outline"
              className="border-slate-300 text-slate-600 bg-white shadow-sm rounded-sm"
            >
              {generatedUnits.length} Ready
            </Badge>
          </div>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {generatedUnits.map((unit, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-slate-300 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm items-center">
                    <div className="font-semibold text-slate-900">
                      {unit.code}
                    </div>
                    <div className="text-slate-500 uppercase text-xs font-medium">
                      {unit.type}
                    </div>
                    <div className="text-slate-500 text-xs">
                      {unit.bedrooms}BR / {unit.bathrooms}BA • {unit.unitSize}m²
                    </div>
                    <div className="text-slate-900 font-mono text-xs">
                      ₦{parseFloat(unit.rentAmount as string).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUnit(index)}
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 rounded-sm p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </section>
      )}

      {generatedUnits.length === 0 && batchTemplate.count > 0 && (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-sm bg-slate-50/50">
          <Wand2 className="h-8 w-8 mx-auto mb-3 text-slate-300" />
          <p className="text-sm text-slate-500 font-medium">
            Configure the template above to generate units preview
          </p>
        </div>
      )}
    </div>
  );
}
