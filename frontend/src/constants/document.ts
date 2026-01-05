import { DocumentCategory } from "~/types/document";

export const DOCUMENT_CATEGORIES: { value: DocumentCategory; label: string }[] =
  [
    { value: "lease", label: "Lease Agreement" },
    { value: "receipt", label: "Receipt" },
    { value: "certificate", label: "Certificate" },
    { value: "identity", label: "Identity Document" },
    { value: "contract", label: "Contract" },
    { value: "insurance", label: "Insurance" },
    { value: "inspection", label: "Inspection Report" },
    { value: "maintenance", label: "Maintenance Record" },
    { value: "other", label: "Other" },
  ];