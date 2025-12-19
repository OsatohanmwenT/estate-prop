"use client";

import { Download, FileText } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface LeaseDocumentsProps {
  agreementUrl?: string | null;
}

const LINEAR_CARD_STYLES = {
  card: "rounded-sm border-slate-200 shadow-sm overflow-hidden",
  header: "border-b border-slate-100 bg-slate-50/30 px-6 py-4",
  title: "text-xs font-bold uppercase tracking-widest text-slate-900",
  content: "p-6",
};

export function LeaseDocuments({ agreementUrl }: LeaseDocumentsProps) {
  return (
    <Card className={LINEAR_CARD_STYLES.card}>
      <CardHeader className={LINEAR_CARD_STYLES.header}>
        <CardTitle className={LINEAR_CARD_STYLES.title}>Documents</CardTitle>
      </CardHeader>
      <CardContent className={LINEAR_CARD_STYLES.content}>
        {agreementUrl ? (
          <div className="bg-white border border-slate-200 p-4 rounded-sm flex items-center gap-3 group hover:border-slate-300 transition-colors">
            <div className="h-10 w-10 bg-slate-50 flex items-center justify-center rounded-sm border border-slate-100 text-slate-400">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                Lease Agreement
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                PDF Document
              </p>
            </div>
            <a href={agreementUrl} target="_blank" rel="noopener noreferrer">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-400 hover:text-slate-900"
              >
                <Download className="h-4 w-4" />
              </Button>
            </a>
          </div>
        ) : (
          <div className="border border-dashed border-slate-200 p-6 rounded-sm text-center">
            <p className="text-xs text-slate-400">No documents attached</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
