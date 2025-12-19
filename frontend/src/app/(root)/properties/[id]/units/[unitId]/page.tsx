"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  BadgeCheck,
  BedDouble,
  Building2,
  ChevronRight,
  CreditCard,
  FileText,
  History,
  Home,
  LayoutTemplate,
  User,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import MaxContainer from "~/components/shared/MaxContainer";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn, formatCurrency } from "~/lib/utils";
import { unitService } from "~/services/unitService";

export default function UnitDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const unitId = params.unitId as string;

  const {
    data: unit,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["unit", propertyId, unitId],
    queryFn: () => unitService.getUnitById(propertyId, unitId),
  });

  if (isLoading) {
    return (
      <MaxContainer>
        <div className="space-y-8 pt-6">
          <Skeleton className="h-64 w-full rounded-sm" />
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-40 w-full rounded-sm" />
              <Skeleton className="h-96 w-full rounded-sm" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-sm" />
            </div>
          </div>
        </div>
      </MaxContainer>
    );
  }

  if (error || !unit) {
    return (
      <MaxContainer>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
          <div className="bg-slate-50 p-6 rounded-full">
            <Home className="h-10 w-10 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Unit Not Found
          </h2>
          <p className="text-slate-500 max-w-sm">
            The unit you are looking for does not exist or you don't have
            permission to view it.
          </p>
          <Link href={`/properties/${propertyId}`}>
            <Button variant="outline">Return to Property</Button>
          </Link>
        </div>
      </MaxContainer>
    );
  }

  const isOccupied = unit.status === "occupied";

  return (
    <div className="max-w-7xl mx-auto space-y-10 font-sans pb-24 fade-in text-slate-900 p-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
        <Link
          href="/properties"
          className="hover:text-slate-900 transition-colors"
        >
          Portfolio
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/properties/${propertyId}`}
          className="hover:text-slate-900 transition-colors"
        >
          Property
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-900">Unit {unit.code}</span>
      </div>

      {/* 1. HERO HEADER: Linear Layout */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={cn(
                  "rounded-sm text-[10px] uppercase px-2 py-0.5 font-bold tracking-wider",
                  isOccupied
                    ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                    : "border-amber-200 text-amber-700 bg-amber-50"
                )}
              >
                {unit.status}
              </Badge>
              <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                {unit.type}
              </span>
            </div>

            <h1 className="text-4xl font-light text-slate-900 tracking-tight">
              Unit <span className="font-semibold">{unit.code}</span>
            </h1>

            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="h-4 w-4" />
                <span>{unit.unitSize}m²</span>
              </div>
              <div className="flex items-center gap-2">
                <BedDouble className="h-4 w-4" />
                <span>{unit.bedrooms} Beds</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 flex items-center justify-center border border-slate-300 rounded-[2px] text-[8px] font-bold">
                  WC
                </div>
                <span>{unit.bathrooms} Baths</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="h-10 rounded-sm border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-900 uppercase text-xs font-bold tracking-wider transition-colors"
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Button
              className="h-10 rounded-sm bg-slate-900 text-white hover:bg-slate-800 uppercase text-xs font-bold tracking-wider"
              onClick={() =>
                router.push(`/properties/${propertyId}/units/${unitId}/edit`)
              }
            >
              Edit Unit
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN: Main Info */}
        <div className="lg:col-span-2 space-y-10">
          {/* Tenant Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                Current Tenant
              </h3>
              {!isOccupied && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-bold uppercase tracking-wider"
                  onClick={() =>
                    router.push(
                      `/leases/add?unitId=${unitId}&propertyId=${propertyId}`
                    )
                  }
                >
                  + Add Tenant
                </Button>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-6 relative overflow-hidden group">
              {isOccupied && unit.tenant ? (
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg border border-slate-200">
                    {unit.tenant.fullName?.charAt(0).toUpperCase() || "T"}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-slate-900">
                      {unit.tenant.fullName}
                    </h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500">
                      <span>{unit.tenant.email}</span>
                    </div>
                    <div className="pt-3 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] uppercase font-bold tracking-wider"
                      >
                        Lease Active
                      </Badge>
                      <Link
                        href={`/tenants/${unit.tenant.id}`}
                        className="text-xs font-medium text-slate-400 hover:text-slate-900 underline underline-offset-4 transition-colors"
                      >
                        View Tenant Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50/50 rounded-sm border border-dashed border-slate-200">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">
                    Unit is Vacant
                  </p>
                  <p className="text-xs text-slate-500 mt-1 mb-4 max-w-xs">
                    This unit currently has no active tenant assigned.
                  </p>
                  <Button
                    size="sm"
                    className="h-8 rounded-sm bg-slate-900 text-white text-xs uppercase font-bold tracking-wider"
                    onClick={() =>
                      router.push(
                        `/leases/add?unitId=${unitId}&propertyId=${propertyId}`
                      )
                    }
                  >
                    Assign Tenant
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Details & Amenities */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400" />
              Unit Specification
            </h3>
            <div className="grid grid-cols-2 bg-white border border-slate-200 rounded-sm divide-x divide-slate-100">
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Floor Level
                  </p>
                  <p className="text-lg text-slate-900">
                    {unit.floor === 0
                      ? "Ground Floor"
                      : `${unit.floor}th Floor`}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Space
                  </p>
                  <p className="text-lg text-slate-900">
                    {unit.unitSize}{" "}
                    <span className="text-sm text-slate-400">Sq meters</span>
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Type
                  </p>
                  <p className="text-lg text-slate-900">{unit.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Condition
                  </p>
                  <Badge
                    variant="outline"
                    className="rounded-sm border-slate-200 text-slate-600 text-[10px] uppercase tracking-wider"
                  >
                    {unit.condition || "Good"}
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Tabs for History */}
          <Tabs defaultValue="maintenance" className="w-full">
            <TabsList className="bg-transparent p-0 border-b border-slate-200 w-full justify-start h-auto rounded-none gap-6">
              <TabsTrigger
                value="maintenance"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 data-[state=active]:text-slate-900"
              >
                Maintenance
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 data-[state=active]:text-slate-900"
              >
                History
              </TabsTrigger>
            </TabsList>

            <div className="pt-6">
              <TabsContent value="maintenance" className="m-0">
                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-200 rounded-sm bg-slate-50/50">
                  <Wrench className="h-8 w-8 text-slate-300 mb-3" />
                  <p className="text-sm font-medium text-slate-900">
                    No active maintenance
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    There are no maintenance requests for this unit.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="history" className="m-0">
                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-200 rounded-sm bg-slate-50/50">
                  <History className="h-8 w-8 text-slate-300 mb-3" />
                  <p className="text-sm font-medium text-slate-900">
                    No history available
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Activity log for this unit will appear here.
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* RIGHT COLUMN: Financials & Quick Stats */}
        <div className="space-y-8">
          {/* Financial Card */}
          <div className="bg-[#1A1A1A] text-white p-6 rounded-sm space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
                  Current Rent
                </p>
                <h3 className="text-2xl font-light">
                  {unit.rentAmount
                    ? formatCurrency(Number(unit.rentAmount))
                    : "—"}
                  <span className="text-sm text-white/30 font-normal">/yr</span>
                </h3>
              </div>
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white/60">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/40 uppercase tracking-wider">
                  Status
                </span>
                <Badge
                  className={cn(
                    "border-0 rounded-sm text-[10px] px-2",
                    isOccupied
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-amber-500 text-white hover:bg-amber-600"
                  )}
                >
                  {isOccupied ? "Occupied" : "Vacant"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-slate-200 p-6 rounded-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">
              Quick Actions
            </h4>

            <Button
              variant="outline"
              className="w-full justify-start h-9 text-xs border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <FileText className="h-3.5 w-3.5 mr-2 text-slate-400" />
              Generate Rent Invoice
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-9 text-xs border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <BadgeCheck className="h-3.5 w-3.5 mr-2 text-slate-400" />
              Log Inspection
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-9 text-xs border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <AlertCircle className="h-3.5 w-3.5 mr-2 text-slate-400" />
              Report Issue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
