---
description: Guide to ensuring code quality, reviewing errors, and identifying bad practices
---

# Estate Project - Errors & Code Review Guide

## 1. Common Errors & Anti-Patterns

### ❌ 1. Missing Organization Scoping (Security Critical)
**Bad Code:**
```typescript
// Backend Service
async getAll() {
  return await db.select().from(users); // Returns ALL users from ALL companies!
}
```
**Why it's bad:** Severe data leak. One tenant can see another tenant's data.

**✅ Fix:**
```typescript
async getAll(organizationId: string) {
  return await db.select().from(users).where(eq(users.organizationId, organizationId));
}
```

### ❌ 2. Prop Drilling
**Bad Code:**
```tsx
// Passing props through 5 levels of components that don't need them
<Layout user={user}>
  <Header user={user}>
    <Avatar user={user} />
  </Header>
</Layout>
```

**✅ Fix:**
Use **Composition** or **Context/Stores**.
```tsx
// Layout doesn't need to know about user
<Layout>
  <Header>
    <UserAvatar /> {/* Connected to store/query directly */}
  </Header>
</Layout>
```

### ❌ 3. "Any" Types
**Bad Code:**
```typescript
const handleData = (data: any) => {
  console.log(data.foo.bar); // Crash if foo is undefined
}
```

**✅ Fix:**
Define an interface or use `unknown` if strictly necessary.
```typescript
interface DataPayload {
  foo?: { bar: string };
}
```

### ❌ 4. Not Handling API Errors in UI
**Bad Code:**
```ts
const { data } = useQuery(...);
return <div>{data.map(...)}</div>; // Crash if query fails or data is undefined
```

**✅ Fix:**
```ts
const { data, isLoading, error } = useQuery(...);
if (isLoading) return <Spinner />;
if (error) return <ErrorView message={error.message} />;
if (!data) return null;
```

---

## 2. Reviewing Errors

When debugging or reviewing code, check these 3 areas first:

### 1. Network Tab (Frontend)
- **Status 401/403**: Auth issue. Check if cookie is set or token is passed.
- **Status 400**: Validation issue. Check `response.data.message` (Zod errors).
- **Status 500**: Backend crash. Check backend terminal logs.

### 2. Terminal Logs (Backend)
- Look for SQL errors `(e.g., column does not exist)`.
- Look for Zod validation failures (often hidden in `400` responses but logged if using `asyncHandler`).

### 3. Console Logs (Frontend)
- **React Hydration Error**: HTML generated on server doesn't match client (common with `Date` or `random()` usage).
- **Unique key prop**: Missing `key` in `.map()`.

---

## 3. "Bad Code" Detection Checklist

When reviewing a file, if you see these, Refactor immediately:

- [ ] **Hardcoded Strings/Magic Numbers**: `if (status === 2)` -> `if (status === DOCUMENT_STATUS.DRAFT)`
- [ ] **Console Logs left in production**: remove `console.log` in final PRs.
- [ ] **Long Components (>300 lines)**: Split into smaller sub-components.
- [ ] **Inline Styles**: `<div style={{ margin: 10 }}>` -> Use Tailwind `<div className="m-2">`.
- [ ] **Unused Imports**: Delete them to keep bundle size small.

---

## 4. Debugging Workflow

1. **Isolate**: Is it Frontend (UI/State) or Backend (API/DB)?
2. **Reproduce**: Can you make it happen consistently?
3. **Log**: Add *temporary* logs in the Controller (input) and Service (processing).
4. **Fix**: Apply fix.
5. **Verify**: Test the fix AND ensure no regressions (did you break the component next to it?).
