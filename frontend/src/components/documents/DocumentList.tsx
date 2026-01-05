import {
  Download,
  File,
  FileText,
  Image as ImageIcon,
  MoreVertical,
  Trash2,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
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
import { cn, formatDate } from "~/lib/utils";
import { Document } from "~/types/document";
import { useDeleteDocument } from "~/lib/query/documents";
import { toast } from "sonner";

interface DocumentListProps {
  documents: Document[];
  onDownload?: (document: Document) => void;
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) {
    return <ImageIcon className="h-4 w-4 text-blue-500" />;
  }
  if (fileType.includes("pdf")) {
    return <FileText className="h-4 w-4 text-red-500" />;
  }
  return <File className="h-4 w-4 text-slate-500" />;
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "—";
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

export function DocumentList({ documents, onDownload }: DocumentListProps) {
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const deleteMutation = useDeleteDocument();

  const handleDelete = async () => {
    if (!documentToDelete) return;

    try {
      await deleteMutation.mutateAsync(documentToDelete);
      toast.success("Document deleted successfully");
      setDocumentToDelete(null);
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-slate-200 rounded-sm bg-white">
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
      <div className="border border-slate-200 rounded-sm bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Name
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Category
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Size
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Uploaded
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow
                key={doc.id}
                className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
              >
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-sm bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                      {getFileIcon(doc.fileType)}
                    </div>
                    <span className="text-sm font-medium text-slate-900 truncate">
                      {doc.fileName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border",
                      getCategoryColor(doc.category)
                    )}
                  >
                    {doc.category}
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-xs text-slate-500 font-medium">
                    {formatFileSize(doc.fileSize)}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-xs text-slate-500 font-medium">
                    {formatDate(doc.uploadedAt)}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-slate-400 hover:text-slate-600"
                      >
                        <MoreVertical className="h-4 w-4" />
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600 flex items-center gap-2"
            >
              {deleteMutation.isPending ? (
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
