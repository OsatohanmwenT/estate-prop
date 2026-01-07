"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExpiredLeases = updateExpiredLeases;
const lease_service_1 = __importDefault(require("../services/lease.service"));
async function updateExpiredLeases() {
    const result = { updated: 0, errors: [] };
    try {
        const expiredLeases = await lease_service_1.default.updateExpiredLeases();
        result.updated = expiredLeases.length;
        console.log(`✅ Updated ${expiredLeases.length} leases to expired status`);
    }
    catch (error) {
        throw new Error(`Failed to update expired leases: ${error.message}`);
    }
    return result;
}
//# sourceMappingURL=updateExpiredLeases.js.map