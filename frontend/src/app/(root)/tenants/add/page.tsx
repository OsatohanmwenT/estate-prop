"use client";

import { ChevronLeft, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MaxContainer from "~/components/shared/MaxContainer";
import { AddTenantForm } from "~/components/tenants/form/AddTenantForm";
import { useCreateTenant } from "~/lib/query";
import { CreateTenantFormData } from "~/schemas/tenant";

// Dummy data for testing - remove in production
const DUMMY_TENANT_DATA: Partial<CreateTenantFormData> = {
  fullName: "Adaeze Nnamdi",
  email: "adaeze.nnamdi@email.com",
  phone: "+234 803 555 1234",
  dateOfBirth: "1992-03-15",
  nationality: "Nigerian",
  currentAddress: "15 Admiralty Way, Lekki Phase 1, Lagos",
  occupation: "Marketing Manager",
  employerName: "GlobalTech Solutions Ltd",
  employerAddress: "Plot 42, Victoria Island, Lagos",
  annualIncome: 7500000,
  nokName: "Chidinma Nnamdi",
  nokPhone: "+234 805 222 3333",
  guarantorName: "Emeka Okafor",
  guarantorPhone: "+234 809 444 5555",
  idType: "national_id",
  idNumber: "NIN-98765432101",
  allottedParking: "B-15",
  accessCardNo: "AC-2024-0289",
  notes:
    "Referred by existing tenant Mr. Chukwuma. Works in tech industry. Prefers electronic communication.",
};

export default function AddTenantPage() {
  const router = useRouter();
  const createTenantMutation = useCreateTenant();

  const handleSubmit = (data: CreateTenantFormData) => {
    // Prepare metadata
    const metadata = JSON.stringify({
      occupation: data.occupation,
      currentAddress: data.currentAddress,
      guarantorName: data.guarantorName,
      guarantorPhone: data.guarantorPhone,
      allottedParking: data.allottedParking,
      accessCardNo: data.accessCardNo,
      idType: data.idType,
      idNumber: data.idNumber,
      dateOfBirth: data.dateOfBirth,
      nationality: data.nationality,
      employerName: data.employerName,
      employerAddress: data.employerAddress,
      notes: data.notes,
    });

    createTenantMutation.mutate(
      {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        nokName: data.nokName,
        nokPhone: data.nokPhone,
        annualIncome: data.annualIncome,
        metadata,
      },
      {
        onSuccess: () => {
          toast.success("Tenant created successfully");
          router.push("/people");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Failed to create tenant"
          );
        },
      }
    );
  };

  return (
    <MaxContainer className="!px-0">
      {/* Linear Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-7 py-4 mb-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-4">
            {/* Back Link */}
            <Link
              href="/people"
              className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
            >
              <ChevronLeft className="h-3 w-3" />
              Back to People
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
                  Add New Tenant
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Enter tenant details including personal information, contact
                  details, and documents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-7">
        <AddTenantForm
          initialData={DUMMY_TENANT_DATA}
          onSubmit={handleSubmit}
          isLoading={createTenantMutation.isPending}
        />
      </div>
    </MaxContainer>
  );
}
