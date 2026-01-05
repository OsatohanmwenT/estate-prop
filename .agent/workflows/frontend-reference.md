---
description: Frontend architectural patterns, React/Next.js guidelines, and State Management
---

# Estate Project - Frontend Reference

## 1. Architecture Overview

The frontend is built with **Next.js (App Router)**, **React**, **Tailwind CSS**, and **TanStack Query**.

### Layer Responsibilities

| Layer | Responsibility | Key Principles |
|-------|----------------|----------------|
| **App (Pages)** | Routing & Layout | Server Components by default. Fetch initial data (optional) or delegate to client query. |
| **Components** | UI Representation | Reusable. Dumb (presentational) or Smart (connected). |
| **Services** | API Communication | Typed wrapper around Axios. No React state here. |
| **Queries (Lib)** | State & Data Fetching | TanStack Query hooks. Caching, deduping, mutations. |
| **Stores** | Global UI State | Zustand. Only for client-only global UI state (sidebar, modals). |

---

## 2. API Service Layer

We use a class-based service pattern extending `BaseService` to encapsulate API endpoints.

```typescript
// src/services/exampleService.ts
import { BaseService } from "./baseService";

class ExampleService extends BaseService {
  constructor() {
    super("examples"); // logical base path
  }

  // 1. Typed Methods
  async getAll(): Promise<Example[]> {
    return this.get<Example[]>("/");
  }

  async create(data: CreateExampleData): Promise<Example> {
    return this.post<Example, CreateExampleData>("/", data);
  }
}

export const exampleService = new ExampleService();
```

---

## 3. Data Fetching (TanStack Query)

We wrap all API calls in custom hooks located in `src/lib/query/`.

### Query Keys
Store keys in `src/lib/query/keys/index.ts` to avoid duplication.
```typescript
export const exampleKeys = {
  all: ["examples"] as const,
  lists: () => [...exampleKeys.all, "list"] as const,
  detail: (id: string) => [...exampleKeys.all, "detail", id] as const,
};
```

### Custom Hooks
```typescript
// src/lib/query/examples.ts
export function useExamples() {
  return useQuery({
    queryKey: exampleKeys.lists(),
    queryFn: () => exampleService.getAll(),
  });
}

export function useCreateExample() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExampleData) => exampleService.create(data),
    onSuccess: () => {
      // Automatic invalidation serves fresh data
      queryClient.invalidateQueries({ queryKey: exampleKeys.lists() });
    },
  });
}
```

---

## 4. Directory Structure

```
frontend/src/
├── app/             # Next.js App Router
├── components/      # React Components
│   ├── ui/          # Shadcn/Radix Primitives
│   └── [domain]/    # Domain Specific (e.g., properties/, documents/)
├── lib/video
│   └── query/       # TanStack Query Hooks
├── services/        # API integration classes
├── stores/          # Zustand stores
├── types/           # Shared TypeScript interfaces
└── validations/     # Form schemas (Zod)
```

---

## 5. Next.js Patterns

### "use client" vs Server Components

- **Server Components** (Default): Use for fetching data (if not using Query on client for real-time), layout, and static HTML. Cannot use hooks (`useState`, `useEffect`).
- **Client Components** (`"use client"`): Use for interactivity, event listeners, hooks, and browser APIs.

### Routing
Use `next/link` for internal navigation and `useRouter` for programmatic navigation.

```tsx
// Navigating programmatically
const router = useRouter();
router.push("/dashboard"); // Prefetches by default
```

---

## 6. Styling (Tailwind CSS)

- **Utility First**: Use utility classes for layout, spacing, and colors.
- **cn() utility**: Always use the `cn()` helper when merging classes in reusable components to resolve Tailwind conflicts.
  ```tsx
  <div className={cn("bg-red-500 p-4", className)}>...</div>
  ```
- **File Organization**: Don't use CSS modules unless absolutely necessary. Stick to Tailwind.

---

## 7. Form Management

Use **React Hook Form** combined with **Zod** for validation.

**Critical Guideline**: Always use the custom `Field` components (`components/ui/field.tsx`) for form layouts. This ensures consistent spacing and accessibility.

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, FieldControl, FieldError } from "~/components/ui/field";

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: { ... }
});

const onSubmit = (data) => mutate(data);

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
       <Field>
         <FieldLabel>Username</FieldLabel>
         <Input {...form.register("username")} />
         <FieldError errors={[form.formState.errors.username]} />
       </Field>
    </form>
  </Form>
);
```
