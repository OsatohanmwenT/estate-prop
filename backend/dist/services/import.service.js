"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importService = void 0;
const XLSX = __importStar(require("xlsx"));
const mammoth_1 = __importDefault(require("mammoth"));
const database_1 = require("../database");
const schemas_1 = require("../database/schemas");
exports.importService = {
    async parseFile(file) {
        if (file.mimetype ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.mimetype === "application/vnd.ms-excel") {
            return this.parseExcel(file.buffer);
        }
        else if (file.mimetype ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            return this.parseWord(file.buffer);
        }
        throw new Error("Unsupported file type");
    },
    parseExcel(buffer) {
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const rows = [];
        for (let i = 1; i < rawData.length; i++) {
            const row = rawData[i];
            if (!row || row.length === 0)
                continue;
            rows.push({
                propertyOwner: row[0],
                tenantName: row[1],
                rent: row[2],
                duration: row[3],
                phone: row[4],
            });
        }
        return rows;
    },
    async parseWord(buffer) {
        const result = await mammoth_1.default.convertToHtml({ buffer });
        return [];
    },
    async processImport(rows, organizationId, userId) {
        const results = [];
        let lastPropertyId;
        let lastOwnerId;
        for (const row of rows) {
            try {
                let propertyId = lastPropertyId;
                let ownerId = lastOwnerId;
                if (row.propertyOwner) {
                    const rawText = String(row.propertyOwner);
                    let ownerName = rawText.split(/\n|\/| at /)[0].trim();
                    let propertyName = rawText.trim();
                    if (ownerName.length < 3)
                        ownerName = "Unknown Owner";
                    let ownerResult;
                    const [newOwner] = await database_1.db
                        .insert(schemas_1.owners)
                        .values({
                        fullName: ownerName,
                        organizationId,
                        managedBy: userId,
                    })
                        .returning();
                    ownerId = newOwner.id;
                    lastOwnerId = ownerId;
                    const [newProp] = await database_1.db
                        .insert(schemas_1.properties)
                        .values({
                        ownerId: ownerId,
                        name: propertyName,
                        address: propertyName,
                        organizationId,
                        city: "Unknown",
                        state: "Unknown",
                        category: "residential",
                    })
                        .returning();
                    propertyId = newProp.id;
                    lastPropertyId = propertyId;
                }
                if (!propertyId) {
                    continue;
                }
                const [newUnit] = await database_1.db
                    .insert(schemas_1.propertyUnits)
                    .values({
                    propertyId: propertyId,
                    code: `Unit ${Math.floor(Math.random() * 1000)}`,
                    type: "apartment",
                    status: "occupied",
                    bedrooms: 1,
                    bathrooms: 1,
                    floor: 0,
                    unitSize: 0,
                    rentAmount: "0",
                })
                    .returning();
                if (row.tenantName) {
                    const [newTenant] = await database_1.db
                        .insert(schemas_1.tenants)
                        .values({
                        fullName: row.tenantName,
                        phone: row.phone,
                        organizationId,
                    })
                        .returning();
                    const rentAmount = parseFloat(String(row.rent).replace(/[^0-9.]/g, "")) || 0;
                    const startDate = new Date();
                    const endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
                    if (newTenant) {
                        await database_1.db.insert(schemas_1.leases).values({
                            unitId: newUnit.id,
                            tenantId: newTenant.id,
                            rentAmount: rentAmount.toString(),
                            startDate: startDate,
                            endDate: endDate,
                            status: "active",
                            organizationId,
                            createdBy: userId,
                        });
                    }
                }
                results.push({
                    property: propertyId,
                    owner: ownerId,
                    status: "success",
                });
            }
            catch (error) {
                results.push({
                    property: null,
                    owner: null,
                    status: "error",
                    message: error.message,
                });
            }
        }
        return results;
    },
};
//# sourceMappingURL=import.service.js.map