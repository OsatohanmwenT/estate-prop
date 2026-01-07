"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importMasterSheet = void 0;
const import_service_1 = require("../services/import.service");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.importMasterSheet = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        const user = req.user;
        const parsedRows = await import_service_1.importService.parseFile(req.file);
        const results = await import_service_1.importService.processImport(parsedRows, user.organizationId, user.id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Import failed",
        });
    }
});
//# sourceMappingURL=import.controller.js.map