"use client";

import {
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUnits } from "~/lib/query";
import { cn, formatCurrency } from "~/lib/utils";
import { Unit } from "~/types/property";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { UnitCard } from "./UnitCard";

const UnitsTable = () => {
  const router = useRouter();
  const [propertyType, setPropertyType] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchInput, setSearchInput] = useState<string>("");

  // Fetch units using React Query
  // Note: We're filtering on client side for now, passing empty search to query
  const { data, isLoading, error } = useUnits({
    search: "",
    type: propertyType === "all" ? undefined : propertyType,
  });

  const units = Array.isArray(data) ? data : [];

  // Filter logic
  const filteredData = units.filter((unit: Unit) => {
    // Search filter
    const searchLower = searchInput.toLowerCase();
    const matchesSearch =
      searchInput === "" ||
      unit.code.toLowerCase().includes(searchLower) ||
      unit.property?.name?.toLowerCase().includes(searchLower) ||
      unit.type.toLowerCase().includes(searchLower);

    // Status filter (Tab)
    const matchesStatus =
      activeTab === "all" || unit.status.toLowerCase() === activeTab;

    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (unit: Unit) => {
    router.push(`/properties/${unit.propertyId}/units/${unit.id}`);
  };

  const EmptyState = ({
    title,
    description,
    action,
  }: {
    title: string;
    description: string;
    action?: React.ReactNode;
  }) => (
    <div className="flex flex-col items-center justify-center py-24 text-center border-dashed border border-slate-200 rounded-sm bg-slate-50/50">
      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 border border-slate-200">
        <SlidersHorizontal className="h-5 w-5 text-slate-400" />
      </div>
      <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filters & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Tabs */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="bg-transparent p-0 border-b border-transparent w-full sm:w-auto justify-start h-auto rounded-none gap-6">
            <TabsTrigger
              value="all"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 data-[state=active]:text-slate-900"
            >
              All Units{" "}
              <span className="ml-1.5 py-0.5 px-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                {units.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="occupied"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 data-[state=active]:text-emerald-700"
            >
              Occupied
              <span className="ml-1.5 py-0.5 px-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                {units.filter((u: Unit) => u.status === "occupied").length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="vacant"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 data-[state=active]:text-amber-700"
            >
              Vacant
              <span className="ml-1.5 py-0.5 px-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                {units.filter((u: Unit) => u.status === "vacant").length}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search units..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus-visible:ring-slate-900"
            />
          </div>
          <Link href="/properties/add">
            <Button
              size="sm"
              variant="outline"
              className="h-9 border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-900"
            >
              <Plus className="h-3.5 w-3.5 mr-2" />
              Add Unit
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="rounded-sm border border-slate-200 bg-white overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-slate-50 border-slate-100">
                {[
                  "Code",
                  "Property",
                  "Type",
                  "Status",
                  "Tenant",
                  "Rent",
                  "",
                ].map((h, i) => (
                  <TableHead
                    key={i}
                    className="h-10 text-[10px] uppercase font-bold text-slate-500 tracking-wider"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="border-slate-100">
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : error ? (
        <div className="rounded-sm border border-red-200 bg-red-50 p-8 text-center text-red-600 text-sm">
          Failed to load units. Please try again.
        </div>
      ) : filteredData.length === 0 ? (
        <EmptyState
          title={units.length === 0 ? "No units found" : "No matching units"}
          description={
            units.length === 0
              ? "Get started by creating your first unit in a property."
              : "Try adjusting your search or filters to find what you're looking for."
          }
        />
      ) : (
        <>
          {/* Mobile Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {filteredData.map((unit: Unit) => (
              <UnitCard key={unit.id} unit={unit} />
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block rounded-sm border border-slate-200 bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-slate-50/50 border-slate-200">
                  <TableHead className="h-11 text-[10px] uppercase font-bold text-slate-500 tracking-wider w-[120px] pl-6">
                    Unit Code
                  </TableHead>
                  <TableHead className="h-11 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Property
                  </TableHead>
                  <TableHead className="h-11 text-[10px] uppercase font-bold text-slate-500 tracking-wider w-[140px]">
                    Type
                  </TableHead>
                  <TableHead className="h-11 text-[10px] uppercase font-bold text-slate-500 tracking-wider w-[120px]">
                    Status
                  </TableHead>
                  <TableHead className="h-11 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Current Tenant
                  </TableHead>
                  <TableHead className="h-11 text-[10px] uppercase font-bold text-slate-500 tracking-wider text-right">
                    Rent (Annual)
                  </TableHead>
                  <TableHead className="h-11 w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((unit: Unit) => {
                  const isOccupied = unit.status === "occupied";
                  return (
                    <TableRow
                      key={unit.id}
                      className="cursor-pointer hover:bg-slate-50/50 border-slate-100 transition-colors group"
                      onClick={() => handleRowClick(unit)}
                    >
                      <TableCell className="pl-6 py-4 font-bold text-slate-900 text-sm">
                        {unit.code}
                      </TableCell>
                      <TableCell className="py-4 text-slate-500 text-sm">
                        {unit.property?.name || "—"}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="inline-flex items-center rounded-sm bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 capitalize">
                          {unit.type}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-sm px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider border-0",
                            isOccupied
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          )}
                        >
                          {isOccupied ? "Occupied" : "Vacant"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        {unit.tenant ? (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                              {unit.tenant.firstName?.charAt(0) || "T"}
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              {unit.tenant.firstName} {unit.tenant.lastName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">
                            No tenant
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 text-right font-mono text-xs text-slate-600">
                        {formatCurrency(
                          parseFloat(
                            unit.rentAmount.toString().replace(/,/g, "")
                          ) || 0
                        )}
                      </TableCell>
                      <TableCell className="py-4 text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(unit);
                              }}
                            >
                              <Eye className="mr-2 h-3.5 w-3.5" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/properties/${unit.propertyId}/units/${unit.id}/edit`
                                );
                              }}
                            >
                              <Edit className="mr-2 h-3.5 w-3.5" />
                              Edit Unit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                // Duplicate logic if needed
                              }}
                            >
                              <Copy className="mr-2 h-3.5 w-3.5" />
                              Duplicate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default UnitsTable;
