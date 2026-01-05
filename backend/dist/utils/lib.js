"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qstash = void 0;
const qstash_1 = require("@upstash/qstash");
const config_1 = require("../config");
exports.qstash = new qstash_1.Client({
    token: config_1.config.qstash.token,
    baseUrl: config_1.config.qstash.url,
});
exports.qstash.logs();
//# sourceMappingURL=lib.js.map