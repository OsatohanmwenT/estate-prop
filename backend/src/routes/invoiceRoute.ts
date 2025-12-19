import { Router } from "express";
import {
  createInvoice,
  deleteInvoice,
  generateRecurringInvoice,
  getAllInvoices,
  getInvoiceById,
  getInvoicesByLease,
  getInvoiceStats,
  getOverdueInvoices,
  getUpcomingInvoices,
  recordPayment,
  updateInvoice,
} from "../controllers/invoice.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../utils/validate";
import {
  createInvoiceSchema,
  invoiceIdParamSchema,
  recordPaymentSchema,
  updateInvoiceSchema,
} from "../validations/invoice.validation";

const router: Router = Router();

router.use(authenticate);

router.post("/", validate(createInvoiceSchema), createInvoice);

router.get("/", getAllInvoices);

router.get("/overdue", getOverdueInvoices);

router.get("/upcoming", getUpcomingInvoices);

router.get("/stats", getInvoiceStats);

router.get("/lease/:leaseId", getInvoicesByLease);

router.get("/:invoiceId", validate(invoiceIdParamSchema), getInvoiceById);

router.put(
  "/:invoiceId",
  validate(invoiceIdParamSchema),
  validate(updateInvoiceSchema),
  updateInvoice
);

router.patch(
  "/:invoiceId/payment",
  validate(invoiceIdParamSchema),
  validate(recordPaymentSchema),
  recordPayment
);

router.delete("/:invoiceId", validate(invoiceIdParamSchema), deleteInvoice);

router.post("/generate/:leaseId", generateRecurringInvoice);

export default router;
