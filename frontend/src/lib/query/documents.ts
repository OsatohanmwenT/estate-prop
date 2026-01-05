import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { documentKeys } from "./keys";
import {
  CreateDocumentData,
  CreateFolderData,
  DocumentFilters,
  UpdateDocumentData,
} from "~/types/document";
import { documentService } from "~/services/documentService";

export function useDocuments(filters?: DocumentFilters) {
  return useQuery({
    queryKey: documentKeys.list(filters),
    queryFn: () => documentService.getAllDocuments(filters),
  });
}

export function useDocument(documentId: string, enabled = true) {
  return useQuery({
    queryKey: documentKeys.detail(documentId),
    queryFn: () => documentService.getDocumentById(documentId),
    enabled: !!documentId && enabled,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDocumentData) =>
      documentService.createDocument(data),
    onMutate: async (newDoc) => {
      await queryClient.cancelQueries({ queryKey: documentKeys.all });
      const previousDocuments = queryClient.getQueryData(documentKeys.all);

      queryClient.setQueriesData(
        { queryKey: documentKeys.lists() },
        (old: any) => {
          if (!old) return [newDoc];
          // Create a temporary mock document
          const optimisticDoc = {
            id: "temp-" + Date.now(),
            ...newDoc,
            uploadedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            organizationId: "temp",
          };
          return Array.isArray(old) ? [optimisticDoc, ...old] : [optimisticDoc];
        }
      );

      return { previousDocuments };
    },
    onError: (err, newDoc, context) => {
      // Invalidate on error to sync state
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      data,
    }: {
      documentId: string;
      data: UpdateDocumentData;
    }) => documentService.updateDocument(documentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.detail(variables.documentId),
      });
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) =>
      documentService.deleteDocument(documentId),
    onMutate: async (documentId) => {
      await queryClient.cancelQueries({ queryKey: documentKeys.all });
      const previousDocuments = queryClient.getQueryData(documentKeys.all);

      queryClient.setQueriesData(
        { queryKey: documentKeys.lists() },
        (old: any) => {
          if (Array.isArray(old)) {
            return old.filter((doc: any) => doc.id !== documentId);
          }
          return old;
        }
      );

      // Also try to remove from folder view if possible, by iterating all queries?
      // For now, lists() covers "All Documents". specific folder lists might need strict keys.

      return { previousDocuments };
    },
    onError: (err, newDoc, context) => {
      toast.error("Failed to delete document");
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
    },
  });
}

export function useFolders(propertyId?: string) {
  return useQuery({
    queryKey: documentKeys.folderList(propertyId),
    queryFn: () => documentService.getAllFolders(propertyId),
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFolderData) => documentService.createFolder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.folders() });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (folderId: string) => documentService.deleteFolder(folderId),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: documentKeys.folders() });
    },
    onError: () => {
      toast.error("Failed to delete folder");
    },
  });
}
