import { FileUp } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Document } from "~/types/document";
import { DocumentFilters } from "../DocumentFilters";
import { DocumentGrid } from "../DocumentGrid";
import { DocumentList } from "../DocumentList";

interface FileSectionProps {
  documents: Document[];
  isLoading: boolean;
  viewMode: "grid" | "list";
  search: string;
  category: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  onDownload: (doc: Document) => void;
  onUploadClick: () => void;
}

export function FileSection({
  documents,
  isLoading,
  viewMode,
  search,
  category,
  onSearchChange,
  onCategoryChange,
  onViewModeChange,
  onDownload,
  onUploadClick,
}: FileSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          All Files
          {documents.length > 0 && (
            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-200">
              {documents.length}
            </span>
          )}
        </h2>
        <div className="w-full sm:w-auto">
          <DocumentFilters
            search={search}
            category={category}
            viewMode={viewMode}
            onSearchChange={onSearchChange}
            onCategoryChange={onCategoryChange}
            onViewModeChange={onViewModeChange}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 rounded-sm bg-slate-100" />
          ))}
        </div>
      ) : documents.length > 0 ? (
        viewMode === "grid" ? (
          <DocumentGrid documents={documents} onDownload={onDownload} />
        ) : (
          <DocumentList documents={documents} onDownload={onDownload} />
        )
      ) : (
        <div className="py-16 text-center border border-dashed border-slate-200 rounded-sm bg-slate-50/50">
          <FileUp className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No files in this folder</p>
          <Button
            variant="link"
            onClick={onUploadClick}
            className="text-blue-600 hover:text-blue-500"
          >
            Upload a file
          </Button>
        </div>
      )}
    </div>
  );
}
