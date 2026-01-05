import { ChevronRight, FileText, FolderPlus, Home, Upload } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Folder } from "~/types/document";

interface BrowserHeaderProps {
  currentFolder?: Folder | null;
  onNavigate: (folderId?: string) => void;
  onCreateFolder: () => void;
  onUpload: () => void;
}

export function BrowserHeader({
  currentFolder,
  onNavigate,
  onCreateFolder,
  onUpload,
}: BrowserHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Title Section */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
              My Library
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage all your property documents and folders
            </p>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              onClick={onCreateFolder}
              variant="outline"
              className="h-9 rounded-sm border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              size="sm"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <Button
              onClick={onUpload}
              className="h-9 rounded-sm bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-sm"
              size="sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
