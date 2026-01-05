"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  useDeleteDocument,
  useDocuments,
  useFolders,
  useDeleteFolder,
} from "~/lib/query/documents";
import { documentService } from "~/services/documentService";
import { Document } from "~/types/document";
import { useDocumentsStore } from "~/stores/documentsStore";

export function useDocumentsBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFolderId = searchParams.get("folder") || undefined;
  const queryClient = useQueryClient();

  // Global State (Zustand)
  const {
    search,
    category,
    viewMode,
    isUploadOpen,
    isCreateFolderOpen,
    detailsFolderId,
    actions: storeActions,
  } = useDocumentsStore();

  // Data Fetching
  const { data: documents = [], isLoading: isDocsLoading } = useDocuments({
    search: search || undefined,
    category: category !== "all" ? category : undefined,
    folderId: currentFolderId,
  });

  const { data: folders = [], isLoading: isFoldersLoading } =
    useFolders(undefined);

  const { data: currentFolder } = useQuery({
    queryKey: ["folder", currentFolderId],
    queryFn: () =>
      currentFolderId
        ? documentService.getFolderById(currentFolderId, "DEFAULT_ORG")
        : null,
    enabled: !!currentFolderId,
  });

  // Derived: Details Folder
  const detailsFolder = folders.find((f) => f.id === detailsFolderId) || null;

  // Mutations
  const deleteMutation = useDeleteDocument();
  const deleteFolderMutation = useDeleteFolder();
  const createFolderMutation = useMutation({
    mutationFn: (name: string) =>
      documentService.createFolder({
        name,
        parentFolderId: currentFolderId,
      }),
    onSuccess: () => {
      toast.success("Folder created");
      queryClient.invalidateQueries({ queryKey: ["documents", "folders"] });
      storeActions.setIsCreateFolderOpen(false);
    },
    onError: () => {
      toast.error("Failed to create folder");
    },
  });

  // Actions
  const handleCreateFolder = (name: string) => {
    createFolderMutation.mutate(name);
  };

  const handleDelete = async (documentId: string) => {
    try {
      await deleteMutation.mutateAsync(documentId);
      toast.success("Document deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  /*
   * Folder Details Sheet Logic
   * We need a way to close the sheet after deletion.
   * Since `handleDeleteFolder` is async and handles the mutation, it can also check success
   * and then close the sheet using the store action.
   */

  const handleCloseFolderDetails = () => {
    storeActions.setDetailsFolderId(null);
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await deleteFolderMutation.mutateAsync(folderId);
      toast.success("Folder deleted");
      handleCloseFolderDetails();
    } catch (error) {
      // toast handled by hook
    }
  };

  const handleDownload = (document: Document) => {
    window.open(document.fileUrl, "_blank");
  };

  const navigateToFolder = (folderId?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (folderId) {
      params.set("folder", folderId);
    } else {
      params.delete("folder");
    }
    router.push(`?${params.toString()}`);
  };

  const handleOpenFolderDetails = (folderId: string) => {
    storeActions.setDetailsFolderId(folderId);
  };

  // Derived Data
  const displayedFolders = folders.filter(
    (f) => f.parentFolderId === (currentFolderId || null)
  );

  return {
    state: {
      search,
      category,
      viewMode,
      isUploadOpen,
      isCreateFolderOpen,
      detailsFolderId,
      detailsFolder,
      currentFolderId,
      documents,
      folders: displayedFolders,
      currentFolder,
      isDocsLoading,
      isFoldersLoading,
      isCreatingFolder: createFolderMutation.isPending,
      isDeletingDocument: deleteMutation.isPending,
      isDeletingFolder: deleteFolderMutation.isPending,
    },
    actions: {
      setSearch: storeActions.setSearch,
      setCategory: storeActions.setCategory,
      setViewMode: storeActions.setViewMode,
      setIsUploadOpen: storeActions.setIsUploadOpen,
      setIsCreateFolderOpen: storeActions.setIsCreateFolderOpen,
      handleCreateFolder,
      handleDelete,
      handleDeleteFolder,
      handleDownload,
      navigateToFolder,
      handleOpenFolderDetails,
      handleCloseFolderDetails,
    },
  };
}
