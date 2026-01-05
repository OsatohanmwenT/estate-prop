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

router.get("/:invoiceId", getInvoiceById);

router.put(
  "/:invoiceId",
  validate(updateInvoiceSchema),
  updateInvoice
);

router.patch(
  "/:invoiceId/payment",
  validate(recordPaymentSchema),
  recordPayment
);

router.delete("/:invoiceId", deleteInvoice);

router.post("/generate/:leaseId", generateRecurringInvoice);

export default router;
