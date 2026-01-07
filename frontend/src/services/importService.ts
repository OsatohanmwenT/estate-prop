import { BaseService } from "./baseService";

interface ImportResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    success: number;
    errors: number;
    details: any[];
  };
}

class ImportService extends BaseService {
  constructor() {
    super("import");
  }

  /**
   * Upload master sheet for bulk import
   */
  async importMasterSheet(file: File): Promise<ImportResponse> {
    const formData = new FormData();
    formData.append("file", file);

    // Override the default header for this specific request to allow multipart/form-data
    // BaseService uses axiosInstance which might have default JSON headers.
    // Axios handles Content-Type for FormData automatically if we don't force it,
    // but typically we can pass it in config.
    // Our BaseService.post method allows config.

    return this.post<ImportResponse, FormData>("/master-sheet", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export const importService = new ImportService();
