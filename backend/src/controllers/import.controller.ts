import { Request, Response } from "express";
import { importService } from "../services/import.service";
import { asyncHandler } from "../utils/asyncHandler";

export const importMasterSheet = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const user = (req as any).user;
      const parsedRows = await importService.parseFile(req.file);
      const results = await importService.processImport(
        parsedRows,
        user.organizationId,
        user.id
      );

      const successCount = results.filter((r) => r.status === "success").length;
      const errorCount = results.filter((r) => r.status === "error").length;

      res.status(200).json({
        success: true,
        message: `Processed ${parsedRows.length} rows. Success: ${successCount}, Errors: ${errorCount}`,
        data: {
          total: parsedRows.length,
          success: successCount,
          errors: errorCount,
          details: results,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Import failed",
      });
    }
  }
);
