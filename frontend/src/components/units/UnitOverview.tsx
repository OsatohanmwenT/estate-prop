"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Unit } from "~/types/property";
import { BedDouble, Bath, Ruler, Home, Banknote } from "lucide-react";

interface UnitOverviewProps {
  unit: Unit;
}

export function UnitOverview({ unit }: UnitOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Rent
          </CardTitle>
          <Banknote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            ${parseInt(unit.rentAmount).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            + Utilities included
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Configuration
          </CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-lg">
              <BedDouble className="h-5 w-5 text-muted-foreground" />
              {unit.bedrooms}
            </span>
            <span className="flex items-center gap-1.5 text-lg">
              <Bath className="h-5 w-5 text-muted-foreground" />
              {unit.bathrooms}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {unit.type} Layout
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Unit Size
          </CardTitle>
          <Ruler className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {unit.unitSize}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              sq ft
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Floor {unit.floor}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Condition
          </CardTitle>
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              unit.condition === "good"
                ? "bg-green-500"
                : unit.condition === "fair"
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground capitalize">
            {unit.condition || "Good"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Last inspected: 2 months ago
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
