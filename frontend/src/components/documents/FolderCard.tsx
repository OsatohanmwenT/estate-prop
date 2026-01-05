"use client";

import { Folder, MoreVertical } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { Folder as FolderType } from "~/types/document";
import { Button } from "~/components/ui/button";

interface FolderCardProps {
  folder: FolderType;
  onClick: (folder: FolderType) => void;
  onActionClick?: (folder: FolderType, e: React.MouseEvent) => void;
  variant?: "default" | "minimal";
}

export function FolderCard({
  folder,
  onClick,
  onActionClick,
  variant = "default",
}: FolderCardProps) {
  return (
    <Card
      onClick={() => onClick(folder)}
      className={cn(
        "cursor-pointer !shadow-none border border-grey-200 hover:shadow-md !py-3 transition-all border-slate-200 group bg-white relative",
        variant === "minimal"
          ? "shadow-sm border border-slate-100 hover:bg-slate-50/50"
          : ""
      )}
    >
      <CardContent className="flex items-center !px-3 gap-3 ">
        {/* Icon */}
        <div className="h-10 w-10 shrink-0 bg-blue-50 text-blue-600 rounded-[10px] flex items-center justify-center group-hover:bg-blue-100 transition-colors shadow-sm border border-blue-100/50">
          <Folder className="h-5 w-5 fill-blue-600/20" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <h4 className="text-sm font-medium text-slate-700 truncate group-hover:text-blue-700 transition-colors">
            {folder.name}
          </h4>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            Folder
          </p>
        </div>

        {/* Actions Trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-slate-600 hover:shadow-sm transition-all absolute right-2"
          onClick={(e) => {
            e.stopPropagation();
            onActionClick?.(folder, e);
          }}
        >
          <MoreVertical className="h-3.5 w-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}
