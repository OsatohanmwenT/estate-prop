import { Pool } from "@neondatabase/serverless";
import * as schema from "./schemas";
export declare const pool: Pool;
export declare const db: import("drizzle-orm/neon-serverless").NeonDatabase<typeof schema> & {
    $client: Pool;
};
export declare const directDb: import("drizzle-orm/neon-http").NeonHttpDatabase<typeof schema> & {
    $client: import("@neondatabase/serverless").NeonQueryFunction<false, false>;
};
//# sourceMappingURL=index.d.ts.map