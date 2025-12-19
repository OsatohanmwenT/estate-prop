import { Client } from "@upstash/qstash";
import { config } from "../config";

export const qstash = new Client({
  token: config.qstash.token,
  baseUrl: config.qstash.url,
});

qstash.logs();
