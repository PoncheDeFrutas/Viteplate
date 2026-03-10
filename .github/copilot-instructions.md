# Copilot Instructions

This repository is a scalable frontend starter (Viteplate) based on React 19, TypeScript, Vite, and Feature-Sliced Design (FSD).

## Project Context

- **Frameworks:** React 19, Tailwind CSS v4.
- **State/Data:** Tanstack Query, Tanstack Router, Zustand.
- **Standard:** Use pnpm and follow FSD strictly.
- **Specialized Docs:** Refer to `.github/agents/*.md` for specific role instructions.

## Core Rules

- **FSD Boundaries:** Respect layers (`app > pages > widgets > features > entities > shared`).
- **Encapsulation:** For cross-slice imports, use the slice public API (`index.ts`). Direct deep imports across slices are forbidden.
- **Type Safety:** Strict TypeScript. Zero `any` policy. Use `Zod` for runtime validation.
- **Thin Pages:** Pages only compose; logic goes into features/entities.
- **Auth Flow:** Preserve JWT refresh flow and role-based access (see `src/app/guards`).
- **UI:** Use CVA (Class Variance Authority) for variants and `cn()` utility for merging.

## Testing & Validation

- **Location:** All tests live in the root `/test` directory following the source structure.
- **Mocking:** Use MSW for all API interactions in tests.
- **Checklist:** Before finishing, ensure code passes `pnpm lint`, `pnpm check-types`, `pnpm build`, and `pnpm test`.

## Style & Habits

- Prefer functional composition over inheritance.
- Keep components small and focused.
- Use the established Axios instance in `shared/api/client`.
