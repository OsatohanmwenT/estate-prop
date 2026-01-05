import { create } from "zustand";

interface DocumentsState {
  search: string;
  category: string;
  viewMode: "grid" | "list";
  isUploadOpen: boolean;
  isCreateFolderOpen: boolean;
  detailsFolderId: string | null;
  actions: {
    setSearch: (search: string) => void;
    setCategory: (category: string) => void;
    setViewMode: (viewMode: "grid" | "list") => void;
    setIsUploadOpen: (isOpen: boolean) => void;
    setIsCreateFolderOpen: (isOpen: boolean) => void;
    setDetailsFolderId: (id: string | null) => void;
  };
}

export const useDocumentsStore = create<DocumentsState>((set) => ({
  search: "",
  category: "all",
  viewMode: "grid",
  isUploadOpen: false,
  isCreateFolderOpen: false,
  detailsFolderId: null,
  actions: {
    setSearch: (search) => set({ search }),
    setCategory: (category) => set({ category }),
    setViewMode: (viewMode) => set({ viewMode }),
    setIsUploadOpen: (isUploadOpen) => set({ isUploadOpen }),
    setIsCreateFolderOpen: (isCreateFolderOpen) => set({ isCreateFolderOpen }),
    setDetailsFolderId: (detailsFolderId) => set({ detailsFolderId }),
  },
}));

// Export actions for direct usage if needed, though usually accessed via hook
export const useDocumentsActions = () =>
  useDocumentsStore((state) => state.actions);
