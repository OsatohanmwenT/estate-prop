"use client";

import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Dumbbell,
  Edit,
  Eye,
  Image as ImageIcon,
  MapPin,
  Megaphone,
  MoreVertical,
  Plus,
  Settings,
  ShieldCheck,
  Signal,
  Trash2,
  UserPlus,
  Waves,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import { usePropertyById, usePropertyUnits } from "~/lib/query";
import { cn } from "~/lib/utils";

const getFacilityIcon = (facility: string) => {
  const lower = facility.toLowerCase();
  if (lower.includes("power") || lower.includes("electric"))
    return <Zap className="h-4 w-4 text-amber-500" />;
  if (lower.includes("wifi") || lower.includes("internet"))
    return <Signal className="h-4 w-4 text-blue-500" />;
  if (lower.includes("gym") || lower.includes("fitness"))
    return <Dumbbell className="h-4 w-4 text-rose-500" />;
  if (lower.includes("pool") || lower.includes("water"))
    return <Waves className="h-4 w-4 text-cyan-500" />;
  if (lower.includes("security") || lower.includes("cctv"))
    return <ShieldCheck className="h-4 w-4 text-emerald-500" />;
  return <CheckCircle2 className="h-4 w-4 text-primary" />;
};

export function PropertyDetails() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const { data: property, isLoading } = usePropertyById(
    propertyId,
    !!propertyId
  );

  const { data: units = [], isLoading: unitsLoading } = usePropertyUnits(
    propertyId,
    !!propertyId
  );

  if (isLoading || unitsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-80 md:h-[26rem] w-full rounded-[2rem]" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Property not found</p>
      </div>
    );
  }

  const occupiedUnits = units.filter((u) => u.status === "occupied").length;
  const totalUnits = property.totalUnits || units.length;
  const occupancyRate =
    totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  const totalRevenue = units
    .filter((u) => u.status === "occupied" && u.rentAmount)
    .reduce(
      (sum, u) =>
        sum + (parseFloat(u.rentAmount.toString().replace(/,/g, "")) || 0),
      0
    );

  const handleViewUnit = (unitId: string) => {
    router.push(`/properties/${propertyId}/units/${unitId}`);
  };

  const handleEditUnit = (unitId: string) => {
    router.push(`/properties/${propertyId}/units/${unitId}/edit`);
  };

  const handleViewAllUnits = () => {
    router.push(`/properties/${propertyId}#units`);
  };

  const handleAddUnit = () => {
    router.push(`/properties/${propertyId}/units/add`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 font-sans pb-24 fade-in text-slate-900">
      <div className="space-y-6">
        <div className="h-[500px] w-full grid grid-cols-12 gap-1 rounded-sm overflow-hidden border border-slate-100 p-1 bg-white">
          <div className="col-span-8 relative group overflow-hidden bg-slate-100">
            {property.images[0] ? (
              <Image
                src={property.images[0]}
                alt="Main"
                fill
                className="w-full h-full object-cover grayscale-[0.1] hover:grayscale-0 transition-all duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <Building2 strokeWidth={0.5} className="h-20 w-20" />
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-slate-200 text-slate-900 uppercase tracking-widest text-[10px] font-semibold px-3 py-1 rounded-sm"
              >
                {property.category}
              </Badge>
            </div>
          </div>

          {/* Side Stack (Right, 4 cols) */}
          <div className="col-span-4 grid grid-rows-3 gap-1">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="relative overflow-hidden bg-slate-50">
                {property.images[idx] ? (
                  <Image
                    src={property.images[idx]}
                    alt={`Gallery ${idx}`}
                    fill
                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center border border-dashed border-slate-100">
                    <ImageIcon
                      strokeWidth={0.5}
                      className="h-6 w-6 text-slate-200"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Header Details */}
        <div className="flex flex-col md:flex-row justify-between items-end px-1 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
              <MapPin className="h-4 w-4" />
              <span>
                {property.city}, {property.state}
              </span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              {property.name}
            </h1>
            <p className="text-slate-500">{property.address}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              className="rounded-sm border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-slate-900 h-12 px-6 uppercase tracking-widest text-xs font-semibold gap-2"
              onClick={() => router.push(`/properties/${propertyId}/edit`)}
            >
              <Edit className="h-4 w-4" />
              Edit Property
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-sm border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-slate-900 h-12 px-6 uppercase tracking-widest text-xs font-semibold gap-2"
              onClick={() => {
                if (property.ownerId) {
                  router.push(`/owners/${property.ownerId}`);
                }
              }}
              disabled={!property.ownerId}
            >
              <Settings className="h-4 w-4" />
              Manage Profile
            </Button>
          </div>
        </div>
      </div>

      {/* 2. METRICS DECK: Linear Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="group border border-slate-200 p-6 rounded-sm hover:border-slate-400 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase tracking-widest text-slate-500">
              Occupancy
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
            {/* Status Dot */}
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light text-slate-900">
                {occupancyRate}%
              </span>
              <span className="text-sm text-slate-400 font-mono">
                {occupiedUnits}/{totalUnits}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
              <div
                className="bg-slate-900 h-full"
                style={{ width: `${occupancyRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="group border border-slate-200 p-6 rounded-sm hover:border-slate-400 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase tracking-widest text-slate-500">
              Monthly Revenue
            </span>
            {totalRevenue > 0 && (
              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
            )}
          </div>
          <div className="space-y-1">
            {totalRevenue > 0 ? (
              <>
                <span className="text-3xl font-light text-slate-900">
                  ₦{(totalRevenue / 1000000).toFixed(1)}M
                </span>
                <p className="text-xs text-slate-400">
                  from {occupiedUnits} units
                </p>
              </>
            ) : (
              <>
                <span className="text-3xl font-light text-slate-300">₦0</span>
                <p className="text-xs text-slate-400">No active leases</p>
              </>
            )}
          </div>
        </div>

        <div className="group border border-slate-200 p-6 rounded-sm hover:border-slate-400 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase tracking-widest text-slate-500">
              Total Units
            </span>
            <Building2 className="h-4 w-4 text-slate-400" />
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-light text-slate-900">
              {totalUnits}
            </span>
            <p className="text-xs text-slate-400">
              {occupiedUnits} occupied · {totalUnits - occupiedUnits} vacant
            </p>
          </div>
        </div>

        <div className="group border border-slate-200 p-6 rounded-sm hover:border-slate-400 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase tracking-widest text-slate-500">
              Owner
            </span>
            {property.owner?.phone && (
              <Button
                variant="link"
                className="h-auto p-0 text-xs text-slate-900 font-semibold decoration-slate-900"
                onClick={() =>
                  (window.location.href = `tel:${property.owner?.phone}`)
                }
              >
                Contact
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-slate-200">
              <AvatarFallback className="bg-slate-50 text-xs text-slate-600">
                {property.owner?.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "NA"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-slate-900">
              {property.owner?.fullName || "No owner assigned"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT: Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT COLUMN (Wider) */}
        <div className="lg:col-span-8 space-y-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-900 border-b border-slate-100 pb-2">
              About Property
            </h3>
            <p className="text-slate-600 leading-relaxed font-light">
              {property.description || "No description provided."}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-900 border-b border-slate-100 pb-2">
              Amenities
            </h3>
            {property.amenities && property.amenities.length > 0 ? (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-6">
                {property.amenities.map((am, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 text-center group"
                  >
                    <div className="h-12 w-12 rounded-sm border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-slate-900 group-hover:text-slate-900 transition-colors">
                      {getFacilityIcon(am)}
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500">
                      {am}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                <p>No amenities listed</p>
              </div>
            )}
          </div>

          {/* Unit Inventory List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-900">
                Unit Inventory
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs border-slate-200"
              >
                Download Report
              </Button>
            </div>

            <div className="space-y-0">
              {units.length > 0 ? (
                units.map((unit) => (
                  <div
                    key={unit.id}
                    onClick={() => handleViewUnit(unit.id)}
                    className="grid grid-cols-12 items-center py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="col-span-3 flex items-center gap-3 pl-2">
                      <span className="font-mono text-sm font-semibold text-slate-900">
                        {unit.code}
                      </span>
                    </div>
                    <div className="col-span-3">
                      <span className="text-sm text-slate-500">
                        {unit.type}{" "}
                        <span className="text-slate-300 mx-1">|</span>{" "}
                        {unit.unitSize}m²
                      </span>
                    </div>
                    <div className="col-span-3">
                      {unit.tenant ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border border-slate-100">
                            <AvatarFallback className="text-[9px] bg-slate-100">
                              {unit.tenant.email}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-slate-700 truncate">
                            {unit.tenant.fullName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Vacant
                        </span>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-sm text-[10px] uppercase px-2 py-0.5 font-bold tracking-wider",
                          unit.status === "occupied"
                            ? "border-emerald-500 text-emerald-600 bg-emerald-50/10"
                            : "border-slate-300 text-slate-400"
                        )}
                      >
                        {unit.status}
                      </Badge>
                    </div>
                    <div className="col-span-1 text-right pr-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewUnit(unit.id);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditUnit(unit.id);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Unit
                          </DropdownMenuItem>
                          {unit.status === "vacant" && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/leases/add?unitId=${unit.id}&propertyId=${propertyId}`
                                );
                              }}
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add Tenant
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => e.stopPropagation()}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Unit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-4">
                  <Building2 className="h-12 w-12 text-slate-200 mx-auto" />
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm">No units added yet</p>
                    <p className="text-slate-300 text-xs">
                      Start by adding units to this property
                    </p>
                  </div>
                  <Button
                    onClick={handleAddUnit}
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Unit
                  </Button>
                </div>
              )}
            </div>

            {units.length > 0 && (
              <Button
                variant="ghost"
                onClick={handleViewAllUnits}
                className="w-full border-t border-slate-100 h-10 text-xs uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-transparent"
              >
                View Full Inventory
              </Button>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Revenue Card */}
          {totalRevenue > 0 && (
            <div className="bg-[#1A1A1A] text-white p-6 rounded-sm space-y-8">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Monthly Revenue
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-light">
                    ₦{(totalRevenue / 1000000).toFixed(1)}M
                  </h3>
                  <Badge className="bg-white/10 text-white/80 hover:bg-white/20 text-[10px] border-0 rounded-sm px-1.5 h-5">
                    Active
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs text-white/40">
                  <span>Occupancy</span>
                  <span className="text-white">{occupancyRate}%</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
                <p className="text-[10px] text-white/30 pt-1 text-right">
                  {occupiedUnits} of {totalUnits} units occupied
                </p>
              </div>
            </div>
          )}

          {/* Property Stats (Show when no revenue) */}
          {totalRevenue === 0 && (
            <div className="border border-slate-200 p-6 rounded-sm space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Property Status
                </p>
                <h3 className="text-2xl font-light text-slate-900">
                  {totalUnits} Units
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Occupied</span>
                  <span className="text-slate-900 font-medium">
                    {occupiedUnits}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Vacant</span>
                  <span className="text-slate-900 font-medium">
                    {totalUnits - occupiedUnits}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions (Outline) */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-slate-900">
              Quick Actions
            </h4>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-between h-12 border-slate-200 hover:border-slate-900 hover:bg-white transition-all group rounded-sm"
                onClick={handleAddUnit}
              >
                <span className="flex items-center gap-3">
                  <Plus className="h-4 w-4 text-slate-400 group-hover:text-slate-900" />
                  Add New Unit
                </span>
                <ArrowUpRight className="h-3 w-3 text-slate-300 group-hover:text-slate-900" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between h-12 border-slate-200 hover:border-slate-900 hover:bg-white transition-all group rounded-sm"
              >
                <span className="flex items-center gap-3">
                  <Megaphone className="h-4 w-4 text-slate-400 group-hover:text-slate-900" />
                  Broadcast Message
                </span>
                <ArrowUpRight className="h-3 w-3 text-slate-300 group-hover:text-slate-900" />
              </Button>
            </div>
          </div>

          {/* Insurance Widget */}
          <div className="border border-slate-200 p-6 rounded-sm space-y-4">
            <div className="flex justify-between items-start">
              <ShieldCheck className="h-5 w-5 text-slate-900" />
              <Badge
                variant="outline"
                className="border-emerald-500 text-emerald-600 text-[10px] rounded-sm uppercase px-1.5 h-5"
              >
                Active
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                Property Insurance
              </p>
              <p className="text-xs text-slate-500">
                Premium due: 15 Oct, 2024
              </p>
            </div>
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-slate-900 decoration-slate-300 underline-offset-4"
            >
              View Policy Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
