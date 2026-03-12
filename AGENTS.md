# AGENTS.md

## Repository purpose

Viteplate is a frontend starter template for scalable React 19 applications using Feature-Sliced Design (FSD). It serves as both a reusable production foundation and a living architectural reference. Every change must preserve that role.

## Stack

React 19, TypeScript (~5.9), Vite 7, Tailwind CSS v4, Tanstack Query/Router/Form, Axios, Zod 4, Zustand, class-variance-authority, clsx + tailwind-merge. Testing: Vitest 4, MSW 2, jsdom. Linting: ESLint 9, Prettier 3.8. Package manager: **pnpm** (v10).

## Build, lint, and test commands

```bash
pnpm dev              # Start Vite dev server
pnpm build            # Type-check (tsc -b) then Vite build
pnpm check-types      # Type-check only (tsc -b --pretty false)
pnpm lint             # ESLint on entire project
pnpm format           # Prettier --write on entire project
pnpm test             # Run all tests via Vitest (watch mode)
pnpm test -- --run    # Run all tests once (no watch)
pnpm test -- --run test/unit/shared/api/http/client.test.ts   # Run a single test file
pnpm test -- --run -t "test name pattern"                     # Run tests matching a name
pnpm test:coverage    # Run tests with coverage report
```

**Validation checklist** (run before finishing any meaningful change):

1. `pnpm lint`
2. `pnpm check-types`
3. `pnpm build`
4. `pnpm test -- --run`

## Architecture: Feature-Sliced Design

Dependency direction (import only downward, never upward):

```
app → pages → widgets → features → entities → shared
```

- Cross-slice imports **must** go through the slice's `index.ts` public API.
- Never bypass a slice's public API with deep imports.
- Do not create barrel `index.ts` files that add no architectural value.
- **app**: bootstrap, providers, router, guards, global error handling. No business logic.
- **pages**: thin route-level composition. No direct HTTP calls or complex logic.
- **widgets**: reusable compositions of features/entities/shared UI.
- **features**: business use cases (login, search, toggle-theme). May contain api/model/ui/lib.
- **entities**: domain concepts (user, session). May contain api/model/ui.
- **shared**: domain-agnostic infrastructure (HTTP client, config, lib, types, UI primitives).

## Path aliases

Defined in `tsconfig.app.json` and mirrored in `vite.config.ts`:

| Alias         | Path             |
| ------------- | ---------------- |
| `@app/*`      | `src/app/*`      |
| `@pages/*`    | `src/pages/*`    |
| `@widgets/*`  | `src/widgets/*`  |
| `@features/*` | `src/features/*` |
| `@entities/*` | `src/entities/*` |
| `@shared/*`   | `src/shared/*`   |

## Import conventions

- **Cross-module/cross-slice**: use `@layer/*` aliases (e.g., `import { httpClient } from '@shared/api'`).
- **Within the same module**: use relative paths (`./`, `../`).
- **Type-only imports**: always use `import type { ... }` — enforced by `verbatimModuleSyntax: true`.
- **Barrel exports**: separate value and type re-exports (`export { X }` and `export type { Y }`).
- **Order**: third-party → alias imports → relative imports. Types after values in each group.
- **No default exports**. All exports must be named.

## Naming conventions

- **Files**: `kebab-case.ts` for logic, `PascalCase.tsx` for React components.
- **Directories**: `kebab-case`, singular nouns for FSD layers.
- **Types/Interfaces**: `PascalCase` (e.g., `ApiError`, `SessionAdapter`).
- **Functions**: `camelCase` with action prefixes (`create*`, `get*`, `set*`, `clear*`, `reset*`, `parse*`, `normalize*`, `handle*`, `is*`).
- **Constants**: `UPPER_SNAKE_CASE` for top-level constant objects (e.g., `API_CONFIG`, `AUTH_ENDPOINTS`).
- **React components**: `PascalCase` function names matching file name.

## Formatting (Prettier)

4-space indentation, single quotes, semicolons, trailing commas (`all`), 100-char print width, LF line endings, always parenthesize arrow params. Tailwind class sorting via `prettier-plugin-tailwindcss`. Pre-commit hook runs `pnpm format` automatically.

## TypeScript rules

Strict mode is fully enabled: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitAny`, `strictNullChecks`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`, `erasableSyntaxOnly`. Target: ES2022, module: ESNext, bundler resolution.

- **Never** use explicit `any`. Use `unknown` and narrow with type guards or Zod.
- Avoid unsafe type assertions unless clearly justified.
- Prefer explicit, narrow, validated types.
- Use Zod for runtime validation of API responses and environment variables.

## Error handling

- All API errors are normalized to the `ApiError` interface via `normalizeApiError()` in `@shared/api`.
- Error codes: `UNAUTHORIZED`, `TIMEOUT`, `FORBIDDEN`, `NOT_FOUND`, `NETWORK_ERROR`, `RATE_LIMITED`, `REQUEST_CANCELED`, `CONFLICT`, `VALIDATION_ERROR`, `SERVER_ERROR`, `UNKNOWN_ERROR`.
- Errors include `isRetryable` flag, `traceId`, `timestamp`, structured `details`.
- Zod validation uses `parseWithSchema()` which throws `ZodError` on failure.
- Environment config uses `safeParse` with graceful fallbacks (never throws).

## Auth model

JWT-based auth with role-based access control. Key infrastructure in `@shared/api/http/`:

- `session-adapter.ts`: pluggable token access (get/set/clear).
- `refresh-controller.ts`: single-flight refresh with max 2 retries, then forced logout.
- `request-auth.ts`: attaches Bearer token to outgoing requests.
- `response-auth.ts`: intercepts 401s, triggers refresh, replays queued requests.

Rules: access tokens are expirable, refresh is part of the auth lifecycle, logout clears all session state, tokens must never appear in logs.

## UI rules

- Shared UI in `src/shared/ui/` grouped by kind: `input/`, `display/`, `feedback/`, `overlay/`, `layout/`, `navigation/`.
- Use `cn()` (clsx + tailwind-merge) for class merging.
- Use CVA (class-variance-authority) for component variants.
- Shared UI must remain domain-agnostic. No business logic in UI primitives.

## Testing

- All tests live under root `test/` directory, mirroring `src/` structure.
- Unit tests: `test/unit/`, integration tests: `test/integration/`.
- MSW handlers in `test/msw/handlers/`, fixtures in `test/msw/fixtures/`.
- Test setup (`test/setup.ts`) starts MSW server with `onUnhandledRequest: 'error'`.
- Vitest config: `globals: true`, `environment: 'jsdom'`.
- MSW is the default API mocking strategy.
- Critical logic changes must include or update tests.

## Dependency policy

Do not add dependencies without clear justification. Prefer the existing stack. Dependency changes must be justified by architectural value and maintenance cost.

## Copilot instructions

See `.github/copilot-instructions.md` and `.github/agents/*.agent.md` for specialized agent roles (auth, feature, entity, page, shared-ui, test, reviewer, docs).

## Agent behavior expectations

- Preserve FSD boundaries and slice public APIs.
- Avoid unnecessary refactors and new dependencies.
- Never use `any`. Follow established naming and import patterns.
- Keep changes minimal, reviewable, and scalable.
- When a request conflicts with the architecture or security model, prefer the established rules unless explicitly overridden.
