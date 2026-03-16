# AGENTS.md

## Purpose

Viteplate is a scalable React 19 + TypeScript starter built around Feature-Sliced Design (FSD).
Treat the repo as both production starter code and an architecture reference.

## Rule precedence

Primary sources: `AGENTS.md` -> `.github/copilot-instructions.md` -> `.github/agents/*.agent.md`.
Cursor rules status:

- No `.cursorrules` file found.
- No `.cursor/rules/` directory found.
  If guidance conflicts, prioritize architecture, type safety, and security constraints in this file.

## Stack snapshot

- React 19, TypeScript 5.9, Vite 7, Tailwind CSS v4.
- TanStack Query/Router/Form, Axios, Zod, Zustand.
- `clsx`, `tailwind-merge`, `class-variance-authority`.
- Vitest + jsdom + MSW.
- ESLint 9, Prettier 3, Husky, lint-staged.
- Package manager: `pnpm`.

## Build, lint, and test commands

```bash
pnpm dev
pnpm build
pnpm preview
pnpm check-types
pnpm lint
pnpm format
pnpm test
pnpm test -- --run
pnpm test -- --run test/unit/shared/api/http/client.test.ts
pnpm test -- --run -t "request interceptor"
pnpm test:coverage
```

Testing notes:

- `pnpm test` runs watch mode.
- `pnpm test -- --run` runs once.
- Single file: `pnpm test -- --run <test-file-path>`.
- Single test case by name: `pnpm test -- --run -t "<pattern>"`.
  Recommended pre-handoff checks:

1. `pnpm lint`
2. `pnpm check-types`
3. `pnpm build`
4. `pnpm test -- --run`

## Architecture (FSD)

Allowed dependency direction:

```text
app -> pages -> widgets -> features -> entities -> shared
```

Rules:

- Never import upward in the layer graph.
- Cross-slice imports must go through the slice public API (`index.ts`).
- Do not deep-import another slice internals.
- Do not add barrel files unless they expose meaningful public API.
  Layer roles:
- `app`: bootstrap, providers, router, guards, global setup.
- `pages`: route-level composition only (thin pages).
- `widgets`: reusable compositions of lower layers.
- `features`: user-facing business use cases.
- `entities`: domain models and domain behavior.
- `shared`: domain-agnostic infrastructure and primitives.

## Paths and import conventions

Primary aliases:

- `@app/*` -> `src/app/*`
- `@pages/*` -> `src/pages/*`
- `@widgets/*` -> `src/widgets/*`
- `@features/*` -> `src/features/*`
- `@entities/*` -> `src/entities/*`
- `@shared/*` -> `src/shared/*`
  Import rules:
- Use aliases for cross-module imports.
- Use relative imports inside the same module/slice.
- Use `import type` for type-only imports (`verbatimModuleSyntax` enabled).
- Keep exports explicit: `export { ... }` and `export type { ... }`.
- No default exports; use named exports only.
- Preferred order: third-party, aliases, relative.

## Formatting and linting

Prettier (`.prettierrc`) rules:

- 4 spaces, no tabs.
- Single quotes, semicolons.
- Trailing commas `all`.
- Print width 100.
- Arrow parens always.
- LF line endings.
  Additional style enforcement:
- Tailwind classes sorted by `prettier-plugin-tailwindcss`.
- Pre-commit hook runs `pnpm format`.
- ESLint uses JS + TypeScript + React Hooks + React Refresh recommended configs.

## TypeScript policy

Strict TS is enforced in `tsconfig.app.json`, including:

- `strict`, `noImplicitAny`, `strictNullChecks`.
- `noUnusedLocals`, `noUnusedParameters`.
- `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`.
- `erasableSyntaxOnly`, bundler module resolution.
  Implementation rules:
- Never use explicit `any`.
- Prefer `unknown` + narrowing.
- Avoid unsafe assertions unless clearly justified.
- Validate external/runtime inputs with Zod.

## Naming conventions

- Logic files: `kebab-case.ts`.
- React component files: `PascalCase.tsx`.
- Directories: `kebab-case`, usually singular.
- Types/interfaces: `PascalCase`.
- Functions: `camelCase`, action-oriented names (`get`, `set`, `create`, `parse`, `normalize`, `is`, `handle`).
- Constants: `UPPER_SNAKE_CASE` for top-level constant maps/objects.
- Component function names should match file names.

## Error handling and API behavior

- Normalize transport errors through `normalizeApiError()`.
- Keep failures aligned to shared `ApiError` shape and code conventions.
- Validate payloads with `parseWithSchema()`.
- Keep env/config parsing safe; prefer non-throwing parse flows where configured.

## Auth and security guardrails

- Keep JWT attach/refresh/retry/logout behavior centralized in shared HTTP auth modules.
- Preserve single-flight refresh behavior and bounded retry limits.
- On unrecoverable refresh failure, clear session state safely.
- Preserve role-based route protection.
- Never log or expose access/refresh tokens.

## UI and shared boundaries

- Keep `src/shared/ui/` domain-agnostic.
- Use `cn()` for class merging.
- Use CVA for variant-based styling.
- Do not move business logic into shared UI primitives.

## Testing policy

- Store tests in root `test/`, mirroring `src/` structure.
- Unit tests: `test/unit/`; integration tests: `test/integration/`.
- Use MSW for API mocking (`test/msw/handlers/`, `test/msw/fixtures/`).
- `test/setup.ts` enables MSW with `onUnhandledRequest: 'error'`.
- Meaningful logic changes should include or update tests.

## Dependency policy

- Avoid new dependencies unless architectural benefit is clear.
- Reuse existing patterns/utilities before introducing alternatives.
- Keep changes focused, reviewable, and consistent with FSD + security constraints.
