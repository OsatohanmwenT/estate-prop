"use client";

import { useDocumentsBrowser } from "~/hooks/useDocumentsBrowser";
import { DocumentUploadDialog } from "~/components/file-uploader/DocumentUploadDialog";
import { Separator } from "~/components/ui/separator";
import { BrowserHeader } from "./browser/BrowserHeader";
import { FolderSection } from "./browser/FolderSection";
import { FileSection } from "./browser/FileSection";
import MaxContainer from "~/components/shared/MaxContainer";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { FolderDetailsSheet } from "./FolderDetailsSheet";

export function DocumentsManager() {
  const { state, actions } = useDocumentsBrowser();

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Header & Breadcrumbs & Actions */}
      <BrowserHeader
        currentFolder={state.currentFolder}
        onNavigate={actions.navigateToFolder}
        onCreateFolder={() => actions.setIsCreateFolderOpen(true)}
        onUpload={() => actions.setIsUploadOpen(true)}
      />

      {/* Main Content */}
      <MaxContainer className="py-8 space-y-6">
        <FolderSection
          folders={state.folders}
          isLoading={state.isFoldersLoading}
          onNavigate={actions.navigateToFolder}
          onActionClick={(folder) => actions.handleOpenFolderDetails(folder.id)}
        />

        <Separator className="bg-slate-200" />

        <FileSection
          documents={state.documents}
          isLoading={state.isDocsLoading}
          viewMode={state.viewMode}
          search={state.search}
          category={state.category}
          onSearchChange={actions.setSearch}
          onCategoryChange={actions.setCategory}
          onViewModeChange={actions.setViewMode}
          onDownload={actions.handleDownload}
          onUploadClick={() => actions.setIsUploadOpen(true)}
        />
      </MaxContainer>

      <DocumentUploadDialog
        open={state.isUploadOpen}
        onOpenChange={actions.setIsUploadOpen}
        folderId={state.currentFolderId}
      />

      <CreateFolderDialog
        open={state.isCreateFolderOpen}
        onOpenChange={actions.setIsCreateFolderOpen}
        onCreate={actions.handleCreateFolder}
        isLoading={state.isCreatingFolder}
      />

      <FolderDetailsSheet
        folder={state.detailsFolder}
        isOpen={!!state.detailsFolderId}
        onClose={actions.handleCloseFolderDetails}
        onOpenFolder={actions.navigateToFolder}
        onDelete={(id) => {
          actions.handleDeleteFolder(id);
        }}
        isDeleting={state.isDeletingFolder}
      />
    </div>
  );
}
