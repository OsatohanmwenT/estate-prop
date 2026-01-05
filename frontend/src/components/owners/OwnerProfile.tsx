"use client";

import { ArrowUpRight, Building2, DollarSign, FileText, Mail, Phone, Plus, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { OwnerDocuments } from "~/components/owners/OwnerDocuments";
import { OwnerProperties } from "~/components/owners/OwnerProperties";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { formatCurrency, formatDate } from "~/lib/utils";
import { OwnerWithDetails } from "~/types/tenant";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface OwnerProfileProps {
  owner: OwnerWithDetails;
}


export function OwnerProfile({ owner }: OwnerProfileProps) {
  const router = useRouter();

  console.log("Owner Data:", owner);

  
  const totalRevenue = parseFloat(owner.totalRevenue) || 0;
  const managementFeeTotal = parseFloat(owner.managementFeeTotal || "0") || 0;
  const ownerShareTotal = parseFloat(owner.ownerShareTotal || "0") || 0;

  const managementFeePercentage =
    totalRevenue > 0 ? (managementFeeTotal / totalRevenue) * 100 : 0;
  const ownerSharePercentage =
    totalRevenue > 0 ? (ownerShareTotal / totalRevenue) * 100 : 0;


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="h-20 w-20 border border-slate-200 shadow-sm rounded-lg">
              <AvatarFallback className="bg-slate-100 text-slate-600 text-2xl font-bold rounded-lg">
                {owner.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-blue-500 border-[3px] border-white"></span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
              {owner.fullName}
            </h2>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {owner.email}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {owner.phone}
              </span>
            </div>
          </div>
        </div>

              {/* 2. METRICS DECK: Linear Cards */}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="group border border-slate-200 p-6 rounded-sm hover:border-slate-400 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase tracking-widest text-slate-500">
              Properties
            </span>
            <Building2 className="h-4 w-4 text-slate-400" />
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-light text-slate-900">
              {owner.propertiesCount}
            </span>
            <p className="text-xs text-slate-400">Registered Assets</p>
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
              {owner.unitsCount}
            </span>
            <p className="text-xs text-slate-400">Across all properties</p>
          </div>
        </div>

        <div className="group border border-slate-200 p-6 rounded-sm hover:border-slate-400 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase tracking-widest text-slate-500">
              Total Revenue
            </span>
            {totalRevenue > 0 && (
              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
            )}
          </div>
          <div className="space-y-1">
            {totalRevenue > 0 ? (
              <>
                <span className="text-3xl font-light text-slate-900">
                  {formatCurrency(totalRevenue)}
                </span>
                <p className="text-xs text-slate-400">Lifetime Revenue</p>
              </>
            ) : (
              <>
                <span className="text-3xl font-light text-slate-300">₦0</span>
                <p className="text-xs text-slate-400">No revenue yet</p>
              </>
            )}
          </div>
        </div>

        <div className="group border border-slate-200 p-6 rounded-sm hover:border-slate-400 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase tracking-widest text-slate-500">
              Owner Share
            </span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="space-y-1">
            {ownerShareTotal > 0 ? (
              <>
                <span className="text-3xl font-light text-emerald-700">
                  {formatCurrency(ownerShareTotal)}
                </span>
                <p className="text-xs text-slate-400">
                  {ownerSharePercentage.toFixed(0)}% of revenue
                </p>
              </>
            ) : (
              <>
                <span className="text-3xl font-light text-slate-300">₦0</span>
                <p className="text-xs text-slate-400">No share yet</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT: Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT COLUMN (Wider) */}
        <div className="lg:col-span-8 space-y-12">
          {/* Owner Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-900 border-b border-slate-100 pb-2">
              Owner Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Email Address
                </p>
                <p className="text-sm text-slate-900">{owner.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Phone Number
                </p>
                <p className="text-sm text-slate-900">{owner.phone}</p>
              </div>
              {owner.address && (
                <div className="space-y-1 md:col-span-2">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Mailing Address
                  </p>
                  <p className="text-sm text-slate-900">{owner.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Bank Details Section */}
          {(owner.bankName || owner.accountNumber || owner.accountName) && (
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-900 border-b border-slate-100 pb-2">
                Bank Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {owner.bankName && (
                  <div className="p-4 bg-slate-50/50 rounded-sm border border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Bank Name
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {owner.bankName}
                    </p>
                  </div>
                )}
                {owner.accountNumber && (
                  <div className="p-4 bg-slate-50/50 rounded-sm border border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Account Number
                    </p>
                    <p className="text-sm font-semibold text-slate-900 font-mono">
                      {owner.accountNumber}
                    </p>
                  </div>
                )}
                {owner.accountName && (
                  <div className="p-4 bg-slate-50/50 rounded-sm border border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Account Name
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {owner.accountName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Properties List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-900">
                Property Portfolio
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs border-slate-200 rounded-sm uppercase tracking-widest"
                onClick={() => router.push("/properties/add")}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Property
              </Button>
            </div>

            {owner.properties.length > 0 ? (
              <OwnerProperties properties={owner.properties} />
            ) : (
              <div className="py-12 text-center space-y-4 border border-dashed border-slate-200 rounded-sm">
                <Building2 className="h-12 w-12 text-slate-200 mx-auto" />
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">
                    No properties added yet
                  </p>
                  <p className="text-slate-300 text-xs">
                    Start by adding properties to this owner
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/properties/add")}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Property
                </Button>
              </div>
            )}
          </div>

          {/* Documents Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-900">
                Documents
              </h3>
            </div>
            <OwnerDocuments ownerId={owner.id} />
          </div>
        </div>

        {/* RIGHT COLUMN (Sidebar) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Revenue Breakdown Card */}
          {totalRevenue > 0 && (
            <div className="bg-[#1A1A1A] text-white p-6 rounded-sm space-y-8">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Total Revenue
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-light">
                    {formatCurrency(totalRevenue)}
                  </h3>
                  <Badge className="bg-white/10 text-white/80 hover:bg-white/20 text-[10px] border-0 rounded-sm px-1.5 h-5">
                    Active
                  </Badge>
                </div>
              </div>

              <div className="space-y-6">
                {/* Owner Share */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/60">Owner Share</span>
                    <span className="text-sm font-semibold text-emerald-400">
                      {formatCurrency(ownerShareTotal)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]"
                      style={{ width: `${ownerSharePercentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-white/40">
                    {ownerSharePercentage.toFixed(1)}% of total revenue
                  </p>
                </div>

                {/* Management Fee */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/60">
                      Management Fee
                    </span>
                    <span className="text-sm font-semibold text-blue-400">
                      {formatCurrency(managementFeeTotal)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                      style={{ width: `${managementFeePercentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-white/40">
                    {managementFeePercentage.toFixed(1)}% of total revenue
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Card (Show when no revenue) */}
          {totalRevenue === 0 && (
            <div className="border border-slate-200 p-6 rounded-sm space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Portfolio Status
                </p>
                <h3 className="text-2xl font-light text-slate-900">
                  {owner.propertiesCount} Properties
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Properties</span>
                  <span className="text-slate-900 font-medium">
                    {owner.propertiesCount}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Units</span>
                  <span className="text-slate-900 font-medium">
                    {owner.unitsCount}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-slate-900">
              Quick Actions
            </h4>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-between h-12 border-slate-200 hover:border-slate-900 hover:bg-white transition-all group rounded-sm"
                onClick={() => router.push("/properties/add")}
              >
                <span className="flex items-center gap-3">
                  <Plus className="h-4 w-4 text-slate-400 group-hover:text-slate-900" />
                  Add New Property
                </span>
                <ArrowUpRight className="h-3 w-3 text-slate-300 group-hover:text-slate-900" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between h-12 border-slate-200 hover:border-slate-900 hover:bg-white transition-all group rounded-sm"
                onClick={() => router.push(`/invoices?ownerId=${owner.id}`)}
              >
                <span className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-slate-400 group-hover:text-slate-900" />
                  View Financials
                </span>
                <ArrowUpRight className="h-3 w-3 text-slate-300 group-hover:text-slate-900" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between h-12 border-slate-200 hover:border-slate-900 hover:bg-white transition-all group rounded-sm"
              >
                <span className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-slate-400 group-hover:text-slate-900" />
                  Generate Report
                </span>
                <ArrowUpRight className="h-3 w-3 text-slate-300 group-hover:text-slate-900" />
              </Button>
            </div>
          </div>

          {/* Contact Card */}
          <div className="border border-slate-200 p-6 rounded-sm space-y-4">
            <div className="flex justify-between items-start">
              <Mail className="h-5 w-5 text-slate-900" />
              <Badge
                variant="outline"
                className="border-emerald-500 text-emerald-600 text-[10px] rounded-sm uppercase px-1.5 h-5"
              >
                Verified
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                Contact Owner
              </p>
              <p className="text-xs text-slate-500">
                Member since {formatDate(owner.createdAt)}
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-slate-900 decoration-slate-300 underline-offset-4"
                onClick={() => (window.location.href = `mailto:${owner.email}`)}
              >
                Send Email
              </Button>
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-slate-900 decoration-slate-300 underline-offset-4 block"
                onClick={() => (window.location.href = `tel:${owner.phone}`)}
              >
                Call Owner
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}