"use client";

import {
  Download,
  File,
  FileText,
  Image as ImageIcon,
  MoreVertical,
  Trash2,
  Loader2,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn, formatDate } from "~/lib/utils";
import { Document } from "~/types/document";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useState } from "react";
import { useDeleteDocument } from "~/lib/query/documents";
import { toast } from "sonner";

interface DocumentGridProps {
  documents: Document[];
  onDownload?: (document: Document) => void;
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) {
    return <ImageIcon className="h-8 w-8 text-blue-500" />;
  }
  if (fileType.includes("pdf")) {
    return <FileText className="h-8 w-8 text-red-500" />;
  }
  return <File className="h-8 w-8 text-slate-500" />;
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "Unknown size";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    lease: "bg-emerald-50 text-emerald-700 border-emerald-200",
    receipt: "bg-blue-50 text-blue-700 border-blue-200",
    certificate: "bg-purple-50 text-purple-700 border-purple-200",
    identity: "bg-amber-50 text-amber-700 border-amber-200",
    contract: "bg-indigo-50 text-indigo-700 border-indigo-200",
    insurance: "bg-cyan-50 text-cyan-700 border-cyan-200",
    inspection: "bg-orange-50 text-orange-700 border-orange-200",
    maintenance: "bg-rose-50 text-rose-700 border-rose-200",
    other: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return colors[category] || colors.other;
};

export function DocumentGrid({ documents, onDownload }: DocumentGridProps) {
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const { mutateAsync: deleteDocument, isPending: isDeleting } =
    useDeleteDocument();

  const handleDeleteConfirm = async () => {
    if (documentToDelete) {
      try {
        await deleteDocument(documentToDelete);
        toast.success("Document deleted");
        setDocumentToDelete(null);
      } catch (error) {
        // Error handling managed by hook/toast usually, but safe to catch here
      }
    }
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">
          No documents found
        </h3>
        <p className="text-xs text-slate-500">
          Upload your first document to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="group border border-slate-200 rounded-sm bg-white hover:border-slate-300 hover:shadow-sm transition-all p-4"
          >
            {/* File Icon */}
            <div className="flex items-start justify-between mb-3">
              <div className="h-12 w-12 rounded-sm bg-slate-50 flex items-center justify-center border border-slate-100">
                {getFileIcon(doc.fileType)}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => onDownload?.(doc)}
                    className="text-xs"
                  >
                    <Download className="h-3.5 w-3.5 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setDocumentToDelete(doc.id)}
                    className="text-xs text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* File Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-900 truncate">
                {doc.fileName}
              </h4>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border",
                    getCategoryColor(doc.category)
                  )}
                >
                  {doc.category}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                <span>{formatFileSize(doc.fileSize)}</span>
                <span>{formatDate(doc.uploadedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog
        open={!!documentToDelete}
        onOpenChange={(open) => !open && setDocumentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
