---
description: High-level architectural patterns and design principles used in the project
---

# Estate Project - Design Patterns

## 1. Service-Repository Pattern (Simplified)

We use a simplified Service pattern where the Service acts as both the logic layer and the abstraction over the data layer (Drizzle).

**Why?**
- **Separation of Concerns**: Controllers deal with HTTP, Services deal with Logic/Data.
- **Testability**: Services can be tested independently of Express.
- **Reusability**: A service method (`createUser`) can be called by a Controller, a Cron Job, or a Seed script.

**Pattern:**
```typescript
// Controller -> Service -> Database
itemController.ts -> itemService.ts -> db (Drizzle)
```

## 2. Singleton Services

Services are instantiated as singletons. This prevents the need to instantiate classes on every request and allows for potential caching or connection pooling optimizations in the future.

**Pattern:**
```typescript
class MyService { ... }
export const myService = new MyService(); // Export the instance, not the class
```

## 3. Dependency Injection (Loose)

While we export singletons, we design services to accept dependencies (transactable DB instances) if needed in the future, although strictly mostly we import `db` directly for simplicity in this project phase.

## 4. Multi-Tenancy (Row-Level Security)

The project is **Multi-Tenant** by design. Every major entity table (`documents`, `properties`, `tenants`) has an `organizationId` column.

**Pattern:**
- **Data Isolation**: Never execute a query without a `where organizationId = ?` clause.
- **Context Injection**: The `organizationId` is injected into the request via middleware and passed down to services.

```typescript
// ❌ BAD: Leaks data across organizations
db.select().from(documents); 

// ✅ GOOD: Scoped to tenant
db.select().from(documents).where(eq(documents.organizationId, orgId));
```

## 5. Frontend Optimistic UI

We use TanStack Query's invalidation pattern to simulate real-time updates without complex state management.

**Pattern:**
1. User performs action (Delete Document).
2. Mutation sends API request.
3. `onSuccess` invalidates the `list` query.
4. UI automatically refetches and updates.

## 6. Composition vs Inheritance

In React components (`frontend`), we favor **Composition**.
- Pass specific sub-components as `children` or props rather than making one giant "God Component" with 50 boolean props.

**Pattern:**
```tsx
// ✅ Composition
<Card>
  <CardHeader title="My Title" />
  <CardContent>...</CardContent>
</Card>

// ❌ Inheritance/Configuration Hell
<GenericCard 
  title="My Title" 
  showContent={true} 
  content={...} 
  headerStyle="blue" 
/>
```

## 7. Factory Pattern (Axios)

We use a factory function (`createAxiosInstance`) to create configured API clients. This ensures consistent headers, timeouts, and interceptors across different service usages.
