"use client";

import {
  FileText,
  Folder,
  Info,
  MoreVertical,
  Plus,
  Trash2,
  File,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Separator } from "~/components/ui/separator";
import { Folder as FolderType } from "~/types/document";
import { format } from "date-fns";
import { useDeleteDocument, useDocuments } from "~/lib/query/documents";
import { useState } from "react";
import { DocumentUploadDialog } from "~/components/file-uploader/DocumentUploadDialog";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
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
import { toast } from "sonner";

interface FolderDetailsSheetProps {
  folder: FolderType | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenFolder: (folderId: string) => void;
  onDelete: (folderId: string) => void;
  isDeleting: boolean;
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

export function FolderDetailsSheet({
  folder,
  isOpen,
  onClose,
  onOpenFolder,
  onDelete,
  isDeleting
}: FolderDetailsSheetProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isDeletingFolder, setIsDeletingFolder] = useState(false);

  // Fetch documents for this folder
  const { data: documents = [], isLoading } = useDocuments({
    folderId: folder?.id,
  });

  const deleteDocumentMutation = useDeleteDocument();

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      await deleteDocumentMutation.mutateAsync(documentToDelete);
      toast.success("Document deleted successfully");
      setDocumentToDelete(null);
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  const handleDeleteFolder = () => {
    if (!folder) return;
    onDelete(folder.id);
  };

  const handleDownload = (doc: any) => {
    window.open(doc.fileUrl, "_blank");
  };

  if (!folder) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-[400px] sm:w-[540px] flex flex-col gap-0 p-0 sm:max-w-[540px]">
          <div className="p-6 pb-4">
            <SheetHeader className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 shrink-0 bg-blue-50 text-blue-600 rounded-[12px] flex items-center justify-center border border-blue-100 shadow-sm">
                  <Folder className="h-8 w-8 fill-blue-600/20" />
                </div>
                <div className="space-y-1 pt-1 min-w-0 flex-1">
                  <SheetTitle className="text-xl font-semibold text-slate-900 truncate">
                    {folder.name}
                  </SheetTitle>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                      Folder
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500 border border-slate-200">
                      {documents.length} Files
                    </span>
                  </div>
                </div>
              </div>
            </SheetHeader>
          </div>

          <Separator className="bg-slate-200" />

          <div className="p-6 space-y-8 flex-1 overflow-y-auto">
            {/* Information Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Info className="h-4 w-4 text-slate-400" />
                Information
              </h3>

              <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wider font-medium text-slate-500">
                    Created
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {format(new Date(folder.createdAt), "MMM d, yyyy")}
                  </p>
                  <p className="text-xs text-slate-400">
                    {format(new Date(folder.createdAt), "h:mm a")}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wider font-medium text-slate-500">
                    Last Modified
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {folder.updatedAt
                      ? format(new Date(folder.updatedAt), "MMM d, yyyy")
                      : "N/A"}
                  </p>
                  {folder.updatedAt && (
                    <p className="text-xs text-slate-400">
                      {format(new Date(folder.updatedAt), "h:mm a")}
                    </p>
                  )}
                </div>

                <div className="space-y-1 col-span-2">
                  <p className="text-[11px] uppercase tracking-wider font-medium text-slate-500">
                    Folder ID
                  </p>
                  <code className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200 block w-fit">
                    {folder.id}
                  </code>
                </div>
              </div>
            </div>

            {/* Files Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-400" />
                  Files inside
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1.5"
                  onClick={() => setIsUploadOpen(true)}
                >
                  <Plus className="h-3 w-3" />
                  Add File
                </Button>
              </div>

              <div className="space-y-2">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-md" />
                  ))
                ) : documents.length > 0 ? (
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    {documents.map((doc, i) => (
                      <div
                        key={doc.id}
                        className={cn(
                          "flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors group",
                          i !== documents.length - 1 &&
                            "border-b border-slate-100"
                        )}
                      >
                        <div className="h-8 w-8 shrink-0 bg-slate-50 rounded-md flex items-center justify-center border border-slate-100">
                          {getFileIcon(doc.fileType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium text-slate-900 truncate transform hover:text-blue-600 cursor-pointer"
                            onClick={() => handleDownload(doc)}
                          >
                            {doc.fileName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="uppercase text-[10px] tracking-wider font-medium">
                              {doc.category}
                            </span>
                            <span>•</span>
                            <span>
                              {format(new Date(doc.uploadedAt), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDownload(doc)}
                            >
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDocumentToDelete(doc.id)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                    <p className="text-sm text-slate-500">
                      No files in this folder
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-blue-600 h-auto p-0 mt-1"
                      onClick={() => setIsUploadOpen(true)}
                    >
                      Upload a file
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-200 bg-slate-50/30 mt-auto">
            <div className="flex flex-col gap-3">
              <Button
                className="w-full bg-slate-900 text-white hover:bg-slate-800 shadow-sm rounded-sm"
                onClick={() => {
                  onOpenFolder(folder.id);
                  onClose();
                }}
              >
                Open Folder View
              </Button>
              <Button
                variant="outline"
                className="w-full text-red-600 border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-sm"
                onClick={() => setIsDeletingFolder(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Folder
              </Button>
            </div>
          </div>
        </SheetContent>

        <DocumentUploadDialog
          open={isUploadOpen}
          onOpenChange={setIsUploadOpen}
          folderId={folder.id}
        />

        {/* Document Delete Dialog */}
        <AlertDialog
          open={!!documentToDelete}
          onOpenChange={(open) => !open && setDocumentToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Document?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                document from the folder.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteDocument}
                className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Folder Delete Dialog */}
        <AlertDialog open={isDeletingFolder} onOpenChange={setIsDeletingFolder}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Folder?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-medium text-slate-900">
                  "{folder.name}"
                </span>
                ? This action cannot be undone and will delete all contents
                inside.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
              disabled={isDeleting}
                onClick={handleDeleteFolder}
                className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Sheet>
    </>
  );
}
