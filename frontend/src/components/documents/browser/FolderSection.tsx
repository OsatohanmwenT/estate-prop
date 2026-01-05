import { Skeleton } from "~/components/ui/skeleton";
import { FolderCard } from "../FolderCard";
import { Folder } from "~/types/document";

interface FolderSectionProps {
  folders: Folder[];
  isLoading: boolean;
  onNavigate: (folderId?: string) => void;
  onActionClick: (folder: Folder) => void;
}

export function FolderSection({
  folders,
  isLoading,
  onNavigate,
  onActionClick,
}: FolderSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          Folders
          {folders.length > 0 && (
            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-200">
              {folders.length}
            </span>
          )}
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-sm bg-slate-100" />
          ))}
        </div>
      ) : folders.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onClick={() => onNavigate(folder.id)}
              onActionClick={(f) => onActionClick(f)}
              variant="minimal"
            />
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-400 italic py-2">
          No folders here
        </div>
      )}
    </div>
  );
}
