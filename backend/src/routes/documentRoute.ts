import { Router } from "express";
import {
  createDocument,
  createFolder,
  deleteDocument,
  deleteFolder,
  getAllDocuments,
  getAllFolders,
  getDocumentById,
  getFolderById,
  getFolderTree,
  updateDocument,
  updateFolder,
} from "../controllers/document.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../utils/validate";
import {
  createDocumentSchema,
  createFolderSchema,
  updateDocumentSchema,
  updateFolderSchema,
} from "../validations/document.validation";

const documentRouter: Router = Router();

documentRouter.use(authenticate);

documentRouter.post("/folders", validate(createFolderSchema), createFolder);
documentRouter.get("/folders/tree", getFolderTree);
documentRouter.get("/folders", getAllFolders);
documentRouter.get("/folders/:folderId", getFolderById);
documentRouter.put(
  "/folders/:folderId",
  validate(updateFolderSchema),
  updateFolder
);
documentRouter.delete("/folders/:folderId", deleteFolder);

documentRouter.post("/", validate(createDocumentSchema), createDocument);
documentRouter.get("/", getAllDocuments);

documentRouter.get("/:documentId", getDocumentById);

documentRouter.put(
  "/:documentId",
  validate(updateDocumentSchema),
  updateDocument
);

documentRouter.delete("/:documentId", deleteDocument);

export default documentRouter;
