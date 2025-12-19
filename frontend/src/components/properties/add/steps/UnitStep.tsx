"use client";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";

export function UnitStep({ formData, setFormData }: any) {
  return (
    <div className="space-y-8 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-xl font-semibold mb-1 text-foreground">
          Unit Configuration
        </h3>
        <p className="text-sm text-muted-foreground">
          Define the structure and unit specifications for this property.
        </p>
      </div>

      {/* Structure Toggle */}
      <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
        <div className="space-y-0.5">
          <Label className="text-base">Multi-Unit Property</Label>
          <p className="text-sm text-muted-foreground">
            Is this a complex with multiple similar units (e.g., Block of
            Flats)?
          </p>
        </div>
        <Switch
          checked={formData.isMultiUnit}
          onCheckedChange={(checked) =>
            setFormData({
              ...formData,
              isMultiUnit: checked,
              totalUnits: checked ? 2 : 1,
            })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Multi-Unit Count */}
        {formData.isMultiUnit && (
          <div className="space-y-2 col-span-2">
            <Label>Total Number of Units</Label>
            <Input
              type="number"
              min={2}
              className="bg-background border-border"
              placeholder="e.g. 4, 10, 20"
              value={formData.totalUnits}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalUnits: parseInt(e.target.value) || 2,
                })
              }
            />
            <p className="text-xs text-muted-foreground">
              We will create {formData.totalUnits} units using the template
              below.
            </p>
          </div>
        )}
        {!formData.isMultiUnit && (
          <div className="space-y-2 col-span-2">
            <Label>Unit Name / Number</Label>
            <Input
              className="bg-background border-border"
              placeholder="e.g. Unit 1, Main House, Flat 101"
              value={formData.unitName}
              onChange={(e) =>
                setFormData({ ...formData, unitName: e.target.value })
              }
            />
          </div>
        )}

        <div className="col-span-2">
          <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            {formData.isMultiUnit
              ? "Unit Template Specs"
              : "Unit Specifications"}
          </h4>
        </div>

        <div className="space-y-2">
          <Label>Rent Amount (₦)</Label>
          <Input
            type="number"
            className="bg-background border-border"
            placeholder="0.00"
            value={formData.rentAmount}
            onChange={(e) =>
              setFormData({ ...formData, rentAmount: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Unit Size (sqm)</Label>
          <Input
            type="number"
            className="bg-background border-border"
            placeholder="e.g. 150"
            value={formData.unitSize}
            onChange={(e) =>
              setFormData({
                ...formData,
                unitSize: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Bedrooms</Label>
          <Select
            value={formData.bedrooms?.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, bedrooms: parseInt(value) })
            }
          >
            <SelectTrigger className="bg-background w-full border-border">
              <SelectValue placeholder="Select bedrooms" />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Bedroom" : "Bedrooms"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Bathrooms</Label>
          <Select
            value={formData.bathrooms?.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, bathrooms: parseInt(value) })
            }
          >
            <SelectTrigger className="bg-background w-full border-border">
              <SelectValue placeholder="Select bathrooms" />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Bathroom" : "Bathrooms"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
