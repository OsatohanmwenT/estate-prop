"use client";

import { Building2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddPropertyForm } from "~/components/properties/add/AddPropertyForm";
import { Button } from "~/components/ui/button";

export default function AddPropertyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Simple Linear Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/portfolio")}
              className="h-8 w-8 rounded-sm border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" />
                New Property
              </h1>
              <p className="text-xs text-slate-500">
                Add a new asset to your portfolio
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-8 px-6">
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
          <AddPropertyForm />
        </div>
      </div>
    </div>
  );
}
