---
description: Master index for all coding references and guidelines
---

# Estate Project - Coding References

This project uses a split documentation structure to organize coding standards. Use the specific reference guides below for detailed instructions.

## 📚 Reference Guides

### [Backend Reference](backend-reference.md)
**Use when working on:** `backend/src/`
- API Controller & Route patterns
- Service layer implementation
- Database & Drizzle ORM usage
- Security & Multi-tenancy enforcement

### [Frontend Reference](frontend-reference.md)
**Use when working on:** `frontend/src/`
- Next.js App Router architecture
- API Service integration
- TanStack Query hooks & data fetching
- State management

### [Component Reference](component-reference.md)
**Use when creating/editing:** `components/`
- Component structure & organization
- Props & Interfaces
- Shadcn/UI usage
- Styling best practices

### [Design Patterns](design-patterns.md)
**Use for architectural decisions:**
- Service-Repository pattern
- Frontend Composition
- Optimistic UI updates
- Factory & Singleton patterns

### [Errors & Code Review](error-review-reference.md)
**Use for debugging & quality control:**
- Common anti-patterns to avoid
- Debugging workflows
- Security checklists
- "Bad Code" examples

---

## Quick Command Reference

To consult these guides, you can read the files directly or ask the agent to "check the [backend/frontend] reference".

| Topic | Recommended File |
|-------|------------------|
| "How do I create a new API endpoint?" | `backend-reference.md` |
| "How do I fetch data in React?" | `frontend-reference.md` |
| "How should I structure this new Card?" | `component-reference.md` |
| "Why is my query returning all users?" | `error-review-reference.md` |
| "Should I use context or props?" | `design-patterns.md` |
