"use client";

import { ArrowLeft, ChevronRight, FileText, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { InvoiceForm } from "~/components/invoices/InvoiceForm";
import MaxContainer from "~/components/shared/MaxContainer";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useCreateInvoice } from "~/lib/query/invoices";
import { useLeases } from "~/lib/query/leases";
import { useTenants } from "~/lib/query/tenants";
import { CreateInvoiceFormData } from "~/schemas/invoice";

export default function AddInvoicePage() {
  const router = useRouter();
  const createInvoiceMutation = useCreateInvoice();

  const { data: tenantsData, isLoading: tenantsLoading } = useTenants();
  const { data: leasesData, isLoading: leasesLoading } = useLeases();

  console.log(leasesData, tenantsData)

  const tenants = tenantsData || [];
  const leases = leasesData || [];

  const handleSubmit = async (data: CreateInvoiceFormData) => {
    try {
      const response = await createInvoiceMutation.mutateAsync(data);

      toast.success("Invoice created successfully");
      router.push(`/invoices/${response.id}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create invoice");
    }
  };

  return (
    <MaxContainer className="!px-0">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-7 pb-4">
          <div className="max-w-[1600px] mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400 mb-4">
              <Link
                href="/dashboard"
                className="hover:text-slate-900 transition-colors flex items-center gap-1"
              >
                <Home className="h-3 w-3" />
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link
                href="/invoices"
                className="hover:text-slate-900 transition-colors"
              >
                Invoices
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-900 font-semibold">New Invoice</span>
            </div>

            {/* Title */}
            <div className="flex items-center gap-4">
              <Link href="/invoices">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-sm border-slate-200 hover:border-slate-300 shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <FileText className="h-6 w-6 text-slate-400" />
                  <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-900">
                    Create Invoice
                  </h1>
                </div>
                <p className="text-sm text-slate-500">
                  Generate a new invoice for a tenant
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-7">
          <div className="max-w-4xl mx-auto">
            <Card className="border-slate-200 py-0  rounded-sm">
              <CardHeader className="border-b !py-1 border-slate-100 !pt-3 bg-slate-50">
                <CardTitle className="text-lg font-bold uppercase tracking-wide text-slate-900">
                  Invoice Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <InvoiceForm
                  onSubmit={handleSubmit}
                  isLoading={
                    createInvoiceMutation.isPending ||
                    tenantsLoading ||
                    leasesLoading
                  }
                  tenants={tenants as any}
                  leases={leases as any}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MaxContainer>
  );
}
