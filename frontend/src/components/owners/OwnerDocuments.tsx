"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutGrid, List, Plus, Search } from "lucide-react";
import { useState } from "react";
import { DocumentGrid } from "~/components/documents/DocumentGrid";
import { DocumentList } from "~/components/documents/DocumentList";
import { DocumentUploadDialog } from "~/components/file-uploader/DocumentUploadDialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { DOCUMENT_CATEGORIES } from "~/constants/document";
import { documentService } from "~/services/documentService";
import { toast } from "sonner";

interface OwnerDocumentsProps {
  ownerId: string;
}

export function OwnerDocuments({ ownerId }: OwnerDocumentsProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents", "owner", ownerId, categoryFilter, searchQuery],
    queryFn: () =>
      documentService.getAllDocuments({
        ownerId,
        category: categoryFilter === "all" ? undefined : categoryFilter,
        search: searchQuery || undefined,
      }),
  });

  const handleDownload = (document: any) => {
    window.open(document.fileUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Documents
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Manage and organize documents for this owner
          </p>
        </div>
        <Button
          onClick={() => setIsUploadOpen(true)}
          className="rounded-sm bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-sm bg-white border-slate-200"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px] rounded-sm bg-white border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {DOCUMENT_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-sm border border-slate-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("grid")}
            className={`h-8 w-8 p-0 rounded-sm hover:bg-white ${
              viewMode === "grid"
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-500"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("list")}
            className={`h-8 w-8 p-0 rounded-sm hover:bg-white ${
              viewMode === "list"
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-500"
            }`}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-slate-500">Loading documents...</p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <DocumentGrid
              documents={documents as any}
              onDownload={handleDownload}
            />
          ) : (
            <DocumentList
              documents={documents as any}
              onDownload={handleDownload}
            />
          )}
        </>
      )}

      <DocumentUploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        ownerId={ownerId}
      />
    </div>
  );
}
