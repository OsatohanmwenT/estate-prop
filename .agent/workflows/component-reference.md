---
description: Patterns for UI components, Shadcn/UI usage, and visual consistency
---

# Estate Project - Component Reference

## 1. Component Organization

Components are organized by **Domain**. Shared/Primitive components live in `ui/`.

```
src/components/
├── ui/                 # Shadcn/UI primitives (Button, Input, Card)
├── documents/          # Document-related components
│   ├── DocumentGrid.tsx
│   ├── DocumentList.tsx
│   └── DocumentUploadDialog.tsx
└── properties/         # Property-related components
    ├── PropertyCard.tsx
    └── PropertyForm.tsx
```

---

## 2. Component Structure

Follow this standard template for creating new components.

```tsx
"use client"; // Remove if no interactivity needed

import { AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

// 1. Props interface - Explicit and clean
interface ExampleCardProps {
  title: string;
  isActive?: boolean;
  className?: string; // Always allow className injection
  onAction?: () => void; // Event handlers
}

export function ExampleCard({ 
  title, 
  isActive = false, 
  className,
  onAction 
}: ExampleCardProps) {
  
  // 2. Early returns for empty/loading states if applicable
  if (!title) return null;

  // 3. Render
  return (
    <div 
      className={cn(
        "rounded-lg border p-4 transition-colors",
        isActive ? "bg-blue-50 border-blue-200" : "bg-white border-slate-200",
        className
      )}
    >
      <h3 className="font-semibold text-slate-900">{title}</h3>
      
      {/* 4. Conditional Rendering */}
      {isActive && (
        <Button onClick={onAction} size="sm" className="mt-2">
          Deactivate
        </Button>
      )}
    </div>
  );
}
```

---

## 3. Best Practices

### Empty States
Always provide feedback when lists or data are empty.

```tsx
if (items.length === 0) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="bg-slate-100 p-3 rounded-full mb-3">
        <Icon className="w-6 h-6 text-slate-500" />
      </div>
      <h3 className="text-sm font-medium">No items found</h3>
      <p className="text-xs text-slate-500 mt-1">Get started by creating one.</p>
    </div>
  );
}
```

### Loading States
Use `Skeleton` components that mimics the layout of the loaded content.

```tsx
if (isLoading) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
```

### Event Handlers
Prefix props with `on` (e.g., `onDelete`, `onSubmit`).
Prefix implementation functions with `handle` (e.g., `handleDelete`, `handleSubmit`).

---

## 4. UI Library (Shadcn/UI)

We use Shadcn/UI. These components are copy-pasted into `src/components/ui/`.
- **Do not modify** the primitives unless necessary for global theming.
- **Wrap** them if you need complex pre-configured versions (e.g., `DateRangePicker` wrapping `Popover` + `Calendar`).

**Common Components:**
- **Button**: `variant="default" | "outline" | "ghost" | "destructive"`
- **Dialog/Sheet**: Use for modals and slide-overs.
- **Form**: Use the custom `Field` component wrapper (`components/ui/field.tsx`) which abstracts layout. Do not use raw `FormItem/FormField` unless building complex custom controls.

---

## 5. Icons

Use **Lucide React**.
- Import individually: `import { user, Settings } from "lucide-react"`
- Standard size for inline icons: `w-4 h-4` (16px) or `w-5 h-5` (20px).
