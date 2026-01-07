import { Router } from "express";
import { importMasterSheet } from "../controllers/import.controller";
import multer from "multer";
import { protect } from "../middlewares/auth.middleware";

const router: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/master-sheet", protect, upload.single("file"), importMasterSheet);

export default router;
