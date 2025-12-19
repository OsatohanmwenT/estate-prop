"use client";

import {
    ArrowRight,
    Briefcase,
    Calendar,
    CreditCard,
    Download,
    ExternalLink,
    FileText,
    Mail,
    MapPin,
    Phone,
    User
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn, formatCurrency, formatDate } from "~/lib/utils";
import {
    TenantMetadata,
    TenantProfile as TenantProfileType,
} from "~/types/tenant";

interface TenantProfileProps {
  tenant: TenantProfileType;
}

const LINEAR_CARD_STYLES = {
  card: "rounded-sm border-slate-200 shadow-sm !py-0",
  header: "border-b border-slate-100 bg-slate-50/30 !py-4",
  title: "text-sm font-bold uppercase tracking-widest text-slate-900",
  description: "text-xs text-slate-500",
  content: "p-6",
};

export function TenantProfile({ tenant }: TenantProfileProps) {
  const metadata: TenantMetadata = tenant.metadata || {};

  // Get lease status badge color
  const getLeaseStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "expired":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "terminated":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  // Get payment status badge color
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "overdue":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "partial":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // Get maintenance status badge color
  const getMaintenanceStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Block */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="h-20 w-20 border border-slate-200 shadow-sm rounded-lg">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${tenant.fullName}`}
                alt={tenant.fullName}
                className="rounded-lg"
              />
              <AvatarFallback className="rounded-lg bg-slate-100 text-slate-600 font-bold text-xl">
                {tenant.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-[3px] border-white"></span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {tenant.fullName}
            </h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {tenant.email}
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {tenant.phone}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {tenant.currentLease && (
            <div className="flex flex-col items-end px-5 py-2.5 bg-white border border-slate-200 rounded-sm shadow-sm w-full md:w-auto">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">
                Current Rent
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900">
                  {formatCurrency(Number(tenant.currentLease.rentAmount))}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  / {tenant.currentLease.billingCycle}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Personal Details */}
          <SectionCard
            title="Personal Information"
            description="Basic contact and personal details"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <DetailItem
                label="Full Name"
                value={tenant.fullName}
                icon={User}
              />
              <DetailItem
                label="Email Address"
                value={tenant.email}
                icon={Mail}
              />
              <DetailItem
                label="Phone Number"
                value={tenant.phone}
                icon={Phone}
              />
              <DetailItem
                label="Occupation"
                value={metadata.occupation || "Not specified"}
                icon={Briefcase}
              />
              <DetailItem
                label="Current Address"
                value={metadata.currentAddress || "Not specified"}
                icon={MapPin}
                className="md:col-span-2"
              />

              {(tenant.nokName || tenant.nokPhone) && (
                <>
                  <div className="border-t border-slate-100 col-span-full my-1"></div>
                  <DetailItem
                    label="Next of Kin Name"
                    value={tenant.nokName || "-"}
                    icon={User}
                  />
                  <DetailItem
                    label="Next of Kin Phone"
                    value={tenant.nokPhone || "-"}
                    icon={Phone}
                  />
                </>
              )}
              {(metadata.guarantorName || metadata.guarantorPhone) && (
                <>
                  <div className="border-t border-slate-100 col-span-full my-1"></div>
                  <DetailItem
                    label="Guarantor Name"
                    value={metadata.guarantorName || "-"}
                    icon={User}
                  />
                  <DetailItem
                    label="Guarantor Phone"
                    value={metadata.guarantorPhone || "-"}
                    icon={Phone}
                  />
                </>
              )}
            </div>
          </SectionCard>

          {/* Current Lease */}
          {tenant.currentLease ? (
            <SectionCard
              title="Current Lease Agreement"
              description={`Property: ${tenant.currentLease.property.name}`}
              action={
                <Link
                  href={`/properties/${tenant.currentLease.property.id}`}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1"
                >
                  View Property <ExternalLink className="h-3 w-3" />
                </Link>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <DetailItem
                  label="Unit"
                  value={`${tenant.currentLease.unit.code} (${tenant.currentLease.unit.type})`}
                  icon={MapPin}
                />
                <DetailItem
                  label="Status"
                  value={
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border",
                        getLeaseStatusBadge(tenant.currentLease.status)
                      )}
                    >
                      {tenant.currentLease.status}
                    </Badge>
                  }
                />
                <DetailItem
                  label="Lease Start"
                  value={formatDate(tenant.currentLease.startDate)}
                  icon={Calendar}
                />
                <DetailItem
                  label="Lease End"
                  value={formatDate(tenant.currentLease.endDate)}
                  icon={Calendar}
                />
                <DetailItem
                  label="Rent Amount"
                  value={formatCurrency(Number(tenant.currentLease.rentAmount))}
                  icon={CreditCard}
                />
                <DetailItem
                  label="Security Deposit"
                  value={formatCurrency(
                    Number(tenant.currentLease.depositAmount)
                  )}
                  icon={CreditCard}
                />
              </div>

              {tenant.currentLease.documentUrl && (
                <div className="mt-6 flex items-center gap-3 p-3 border border-slate-200 rounded-sm bg-slate-50/50">
                  <div className="h-9 w-9 bg-white border border-slate-100 rounded-sm flex items-center justify-center shrink-0 shadow-sm">
                    <FileText className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">
                      Lease_Agreement_Signed.pdf
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      PDF Document • 2.4 MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 text-slate-400 hover:text-slate-700"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </SectionCard>
          ) : (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-sm p-8 text-center">
              <p className="text-slate-500 font-medium">
                No active lease found.
              </p>
              <Button variant="outline" className="mt-4" size="sm">
                Create New Lease
              </Button>
            </div>
          )}

          {/* Additional Details */}
          <SectionCard
            title="Additional Details"
            description="Identification and employment records"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <DetailItem
                label="ID Type"
                value={metadata.idType?.replace(/_/g, " ") || "-"}
                className="capitalize"
              />
              <DetailItem label="ID Number" value={metadata.idNumber || "-"} />
              <DetailItem
                label="Employer"
                value={metadata.employerName || "-"}
              />
              <DetailItem
                label="Annual Income"
                value={formatCurrency(Number(tenant.annualIncome))}
              />
              <DetailItem
                label="Allotted Parking"
                value={metadata.allottedParking || "None"}
              />
              <DetailItem
                label="Access Card"
                value={metadata.accessCardNo || "None"}
              />
            </div>
          </SectionCard>
        </div>

        {/* Right Column - History Tabs */}
        <div className="lg:col-span-5 space-y-6">
          <Card className={LINEAR_CARD_STYLES.card}>
            <Tabs defaultValue="payments" className="w-full">
              <CardHeader className="bg-white border-b border-slate-100 px-6 py-4 !pb-2">
                <TabsList className="bg-slate-50/50 p-1 h-9 gap-1 justify-start border border-slate-100 rounded-md w-fit">
                  <TabsTrigger
                    value="payments"
                    className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500 rounded-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    Payments
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500 rounded-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    Docs
                  </TabsTrigger>
                  <TabsTrigger
                    value="communications"
                    className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500 rounded-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    Notes
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent className="p-0">
                {/* Payment Tab */}
                <TabsContent value="payments" className="m-0">
                  {tenant.paymentHistory && tenant.paymentHistory.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {tenant.paymentHistory.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-bold text-slate-900">
                              {formatCurrency(payment.amount)}
                            </span>
                            <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wide">
                              {formatDate(payment.date)} •{" "}
                              {payment.method.replace(/_/g, " ")}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border",
                              getPaymentStatusBadge(payment.status)
                            )}
                          >
                            {payment.status}
                          </Badge>
                        </div>
                      ))}
                      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                        <Link
                          href="#"
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider"
                        >
                          View Full Ledger
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <EmptyState message="No payment history recorded." />
                  )}
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="m-0">
                  {tenant.documents && tenant.documents.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {tenant.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-slate-100 rounded-sm flex items-center justify-center shrink-0">
                              <FileText className="h-4 w-4 text-slate-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700">
                                {doc.name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                {doc.type} • {doc.size || "-"}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 text-slate-400"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No documents uploaded." />
                  )}
                </TabsContent>

                {/* Communications Tab */}
                <TabsContent value="communications" className="m-0">
                  {tenant.communications && tenant.communications.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {tenant.communications.map((comm) => (
                        <div
                          key={comm.id}
                          className="p-4 hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <Badge
                              variant="outline"
                              className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0 rounded-sm border-slate-200 text-slate-500 bg-white"
                            >
                              {comm.type}
                            </Badge>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                              {formatDate(comm.date)}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-900 mb-1">
                            {comm.subject}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {comm.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No notes or communications." />
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* Maintenance */}
          <Card className={LINEAR_CARD_STYLES.card}>
            <CardHeader className={LINEAR_CARD_STYLES.header}>
              <div className="flex items-center justify-between">
                <CardTitle className={LINEAR_CARD_STYLES.title}>
                  Maintenance Requests
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-slate-400"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {tenant.maintenanceRequests &&
              tenant.maintenanceRequests.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {tenant.maintenanceRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-4">
                        <p className="text-xs font-bold text-slate-900 truncate mb-1">
                          {req.description}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          {formatDate(req.date)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border shrink-0",
                          getMaintenanceStatusBadge(req.status)
                        )}
                      >
                        {req.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No maintenance history." />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
function SectionCard({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card className={LINEAR_CARD_STYLES.card}>
      <CardHeader
        className={cn(
          LINEAR_CARD_STYLES.header,
          "flex flex-row items-center justify-between"
        )}
      >
        <div>
          <CardTitle className={LINEAR_CARD_STYLES.title}>{title}</CardTitle>
          {description && (
            <CardDescription className={LINEAR_CARD_STYLES.description}>
              {description}
            </CardDescription>
          )}
        </div>
        {action}
      </CardHeader>
      <CardContent className={LINEAR_CARD_STYLES.content}>
        {children}
      </CardContent>
    </Card>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon?: any;
  label: string;
  value: any;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {Icon && <Icon className="h-3 w-3" />}
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium text-slate-900 break-words">
        {value}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-8 text-center bg-slate-50/30">
      <p className="text-xs text-slate-400 font-medium">{message}</p>
    </div>
  );
}
