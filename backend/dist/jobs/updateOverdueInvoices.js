"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOverdueInvoices = updateOverdueInvoices;
const invoice_service_1 = __importDefault(require("../services/invoice.service"));
async function updateOverdueInvoices() {
    const result = { updated: 0, errors: [] };
    try {
        const overdueInvoices = await invoice_service_1.default.updateOverdueInvoices();
        result.updated = overdueInvoices.length;
        console.log(`✅ Updated ${overdueInvoices.length} invoices to overdue status`);
    }
    catch (error) {
        throw new Error(`Failed to update overdue invoices: ${error.message}`);
    }
    return result;
}
//# sourceMappingURL=updateOverdueInvoices.js.map