---
description: Backend architectural patterns, API standards, and database guidelines
---

# Estate Project - Backend Reference

## 1. Architecture Overview

The backend uses **Express.js** with **Drizzle ORM**. The architecture follows a strict **Controller-Service-Data** layered approach to separate concerns and ensure testability.

### Layer Responsibilities

| Layer | Responsibility | Key Principles |
|-------|----------------|----------------|
| **Routes** | Define endpoints & middleware | Secure every route with `verifySession`. Use `validate()` middleware. |
| **Controllers** | HTTP Request/Response | Extract user context. Validate permissions. Handle errors. Return JSON. |
| **Services** | Business Logic | validation (business rules), DB operations, third-party integrations. |
| **Database** | Data Persistence | Drizzle ORM schemas. Migrations. Types. |

---

## 2. Controller Pattern

Controllers must never contain complex business logic or direct database queries.

```typescript
// src/controllers/[domain].controller.ts

import { Request, Response } from "express";
import { domainService } from "../services/domain.service";
import { asyncHandler } from "../utils/asyncHandler";

// 1. Use asyncHandler to catch errors automatically
export const createItem = asyncHandler(
  async (req: Request, res: Response) => {
    // 2. Always extract context from req.user
    const { organizationId, id: userId } = req.user!;

    // 3. Security Check: Ensure Organization Context
    if (!organizationId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized - No organization ID",
      });
      return;
    }

    const data = req.body;

    // 4. Delegate to Service
    const item = await domainService.createItem(
      organizationId, 
      userId, 
      data
    );

    // 5. Return Standard Response
    res.status(201).json({
      success: true,
      data: item,
      message: "Item created successfully",
    });
  }
);
```

---

## 3. Service Pattern

Services handle the "How". They are reusable and database-aware.

```typescript
// src/services/[domain].service.ts

import { and, eq } from "drizzle-orm";
import { db } from "../database";
import { items } from "../database/schemas/item";

export class DomainService {
  // 1. Context-aware methods (Always pass organizationId)
  async createItem(organizationId: string, userId: string, data: any) {
    const [item] = await db
      .insert(items)
      .values({
        organizationId, // Enforce tenancy
        createdBy: userId,
        ...data,
      })
      .returning();

    return item;
  }

  // 2. Querying with filters
  async getAllItems(
    organizationId: string, 
    filters?: ItemFilters
  ) {
    // strict organization scoping
    const conditions = [eq(items.organizationId, organizationId)];
    
    // ... apply filters ...

    return await db
      .select()
      .from(items)
      .where(and(...conditions));
  }
}

// 3. Export Singleton
export const domainService = new DomainService();
```

---

## 4. Database & Drizzle ORM

### Schema Definitions
Located in `src/database/schemas/`.

```typescript
// src/database/schemas/examples.ts
import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const examples = pgTable("examples", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull(), // CRITICAL for multi-tenancy
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Migration Workflow
1. Modify schema file.
2. Run `pnpm db:generate` to create migration SQL.
3. Run `pnpm db:push` to apply changes (dev) or migrate (prod).

---

## 5. Security Checklist

- [ ] **Multi-tenancy**: Every DB query MUST filter by `organizationId`.
- [ ] **Authentication**: Every private route must use `verifySession`.
- [ ] **Validation**: Every write operation (POST/PUT) must use generic `validate(schema)` middleware.
- [ ] **Secrets**: Never commit `.env` values. Use `config/` files to load env vars.

---

## 6. Directory Structure

```
backend/src/
├── config/        # Environment config
├── controllers/   # Request handlers
├── database/      # Drizzle config & schemas
├── middlewares/   # Auth, Validation, Error middlewares
├── routes/        # Router definitions
├── services/      # Business logic
├── types/         # TypeScript interfaces
├── utils/         # Helpers (asyncHandler, etc)
└── validations/   # Zod schemas
```
