"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Upload } from "lucide-react";
import { MasterImportDialog } from "./MasterImportDialog";

export function ImportDataButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="h-9 rounded-sm border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
        onClick={() => setOpen(true)}
      >
        <Upload className="size-4 mr-2" strokeWidth={1.5} />
        Import Data
      </Button>
      <MasterImportDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
