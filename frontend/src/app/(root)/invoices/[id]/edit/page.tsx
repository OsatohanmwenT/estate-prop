"use client";

import { ArrowLeft, ChevronRight, FileText, Home } from "lucide-react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { InvoiceForm } from "~/components/invoices/InvoiceForm";
import MaxContainer from "~/components/shared/MaxContainer";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useInvoiceById, useUpdateInvoice } from "~/lib/query/invoices";
import { useLeases } from "~/lib/query/leases";
import { useTenants } from "~/lib/query/tenants";
import { CreateInvoiceFormData } from "~/schemas/invoice";
import { UpdateInvoiceData } from "~/types/invoice";

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const { data: invoice, isLoading: invoiceLoading } =
    useInvoiceById(invoiceId);
  const { data: tenantsData, isLoading: tenantsLoading } = useTenants();
  const { data: leasesData, isLoading: leasesLoading } = useLeases();

  const updateInvoiceMutation = useUpdateInvoice();

  const tenants = tenantsData || [];
  const leases = leasesData || [];

  if (!invoiceId) {
    return notFound();
  }

  const handleSubmit = async (data: CreateInvoiceFormData) => {
    try {
      await updateInvoiceMutation.mutateAsync({
        id: invoiceId,
        data: data as UpdateInvoiceData,
      });

      toast.success("Invoice updated successfully");
      router.push(`/invoices/${invoiceId}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update invoice");
    }
  };

  if (invoiceLoading) {
    return <EditInvoiceSkeleton />;
  }

  if (!invoice) {
    return notFound();
  }

  return (
    <MaxContainer className="!px-0">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-7 py-6">
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
              <Link
                href={`/invoices/${invoiceId}`}
                className="hover:text-slate-900 transition-colors"
              >
                INV-{invoice.id.slice(0, 8).toUpperCase()}
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-900 font-semibold">Edit</span>
            </div>

            {/* Title */}
            <div className="flex items-center gap-4">
              <Link href={`/invoices/${invoiceId}`}>
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
                    Edit Invoice
                  </h1>
                </div>
                <p className="text-sm text-slate-500">
                  Update invoice INV-{invoice.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-7">
          <div className="max-w-4xl mx-auto">
            <Card className="border-slate-200 rounded-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg font-bold uppercase tracking-wide text-slate-900">
                  Invoice Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <InvoiceForm
                  initialData={invoice}
                  onSubmit={handleSubmit}
                  isLoading={
                    updateInvoiceMutation.isPending ||
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

function EditInvoiceSkeleton() {
  return (
    <MaxContainer className="!px-0">
      <div className="space-y-8">
        <div className="bg-white border-b border-slate-200 px-4 sm:px-7 py-6">
          <div className="max-w-[1600px] mx-auto">
            <Skeleton className="h-4 w-64 mb-4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-sm" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-7">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-96 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MaxContainer>
  );
}
