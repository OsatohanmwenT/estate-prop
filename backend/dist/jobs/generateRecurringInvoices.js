"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecurringInvoices = generateRecurringInvoices;
const lease_service_1 = __importDefault(require("../services/lease.service"));
const invoice_service_1 = __importDefault(require("../services/invoice.service"));
async function generateRecurringInvoices() {
    const result = { created: 0, skipped: 0, errors: [] };
    try {
        const activeLeases = await lease_service_1.default.getAllLeases({
            status: "active",
            limit: 1000,
        });
        for (const lease of activeLeases) {
            try {
                const invoice = await invoice_service_1.default.generateRecurringInvoice(lease.id);
                if (invoice) {
                    result.created++;
                    console.log(`✅ Generated invoice for lease ${lease.id}`);
                }
                else {
                    result.skipped++;
                }
            }
            catch (error) {
                result.errors.push({
                    leaseId: lease.id,
                    error: error.message,
                });
                console.error(`❌ Failed to generate invoice for lease ${lease.id}:`, error.message);
            }
        }
        console.log(`✅ Invoice generation completed: ${result.created} generated, ${result.skipped} skipped, ${result.errors.length} errors`);
    }
    catch (error) {
        throw new Error(`Failed to fetch active leases: ${error.message}`);
    }
    return result;
}
//# sourceMappingURL=generateRecurringInvoices.js.map