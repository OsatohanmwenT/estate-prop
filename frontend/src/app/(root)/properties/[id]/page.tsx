import { Building2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PropertyDetails } from "~/components/properties/details/PropertyDetails";
import MaxContainer from "~/components/shared/MaxContainer";

export default async function PropertyDetailsPage() {
  return (
    <MaxContainer className="!px-0">
      <div className="bg-white border-b border-slate-200 px-4 sm:px-7 py-4 mb-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-4">
            <Link
              href="/portfolio"
              className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
            >
              <ChevronLeft className="h-3 w-3" />
              Back to Portfolio
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
                  <Building2
                    className="h-5 w-5 text-slate-400"
                    strokeWidth={1.5}
                  />
                  Property Details
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  View and manage property information, units, and tenants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-7 pb-20">
        <PropertyDetails />
      </div>
    </MaxContainer>
  );
}
