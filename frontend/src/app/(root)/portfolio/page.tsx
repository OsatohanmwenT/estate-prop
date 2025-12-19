import { Building2, PlusCircleIcon, UploadIcon } from "lucide-react";
import Link from "next/link";
import PortfolioTabs from "~/components/portfolio/PortfolioTabs";
import MaxContainer from "~/components/shared/MaxContainer";
import { Button } from "~/components/ui/button";

const PortfolioPage = () => {
  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Linear Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
              Portfolio Overview
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your real estate assets and inventory
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-9 rounded-sm border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
            >
              <UploadIcon className="size-4 mr-2" strokeWidth={1.5} />
              Import Data
            </Button>
            <Link href="/properties/add">
              <Button className="h-9 rounded-sm bg-slate-900 text-white hover:bg-slate-800 shadow-none">
                <PlusCircleIcon className="size-4 mr-2" strokeWidth={1.5} />
                Add Property
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <MaxContainer className="py-8">
        <PortfolioTabs />
      </MaxContainer>
    </div>
  );
};

export default PortfolioPage;
