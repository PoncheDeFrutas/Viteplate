# AGENTS.md

## Purpose

Viteplate is a production-ready React 19 + TypeScript starter with strict Feature-Sliced Design (FSD). This file is the primary guidance for coding agents in this repository.

## Rule precedence and external instruction files

Apply instructions in this order:

1. `AGENTS.md`
2. `.github/copilot-instructions.md`
3. `.github/agents/*.agent.md`
   Cursor rules status in this repo:

- `.cursorrules` is not present.
- `.cursor/rules/` is not present.
  If guidance conflicts, prioritize architecture boundaries, type safety, and security behavior.

## Build, lint, and test commands

Run from repository root:

```bash
pnpm dev
pnpm build
pnpm preview
pnpm check-types
pnpm lint
pnpm format
pnpm test
pnpm test:coverage
```

Single-test commands:

```bash
# Run all tests once
pnpm test -- --run
# Run one test file
pnpm test -- --run test/unit/shared/api/http/client.test.ts
# Run tests matching name pattern
pnpm test -- --run -t "request interceptor"
# Run one integration test file
pnpm test -- --run test/integration/auth/login-flow.test.ts
```

Testing notes:

- `pnpm test` is watch mode.
- Prefer `pnpm test -- --run` for pre-handoff checks.
- Keep test paths under root `test/`.
  Recommended validation before finishing meaningful changes:

1. `pnpm lint`
2. `pnpm check-types`
3. `pnpm build`
4. `pnpm test -- --run`

## Architecture, imports, and boundaries

Allowed dependency direction:

```text
app -> pages -> widgets -> features -> entities -> shared
```

Core FSD rules:

- Never import upward in the layer graph.
- Cross-slice imports must go through each slice public API (`index.ts`).
- Do not deep-import internals of another slice.
- Keep `pages` thin and composition-focused.
- Keep `shared` domain-agnostic.
  Layer responsibilities:
- `app`: bootstrap/providers/router/guards/global setup
- `pages`: route-level composition
- `widgets`: reusable compositions
- `features`: user-facing business workflows
- `entities`: domain models and entity-owned logic
- `shared`: infrastructure, utilities, reusable primitives
  Path aliases:
- `@app/*` -> `src/app/*`
- `@processes/*` -> `src/processes/*`
- `@pages/*` -> `src/pages/*`
- `@widgets/*` -> `src/widgets/*`
- `@features/*` -> `src/features/*`
- `@entities/*` -> `src/entities/*`
- `@shared/*` -> `src/shared/*`
  Import/export conventions:
- Use aliases for cross-slice imports.
- Use relative imports inside a slice/module.
- Use `import type` for type-only imports (`verbatimModuleSyntax` is enabled).
- Prefer grouping order: third-party, aliases, relative.
- Use explicit named exports and `export type`.
- Avoid default exports.

## Formatting, linting, and TypeScript policy

Prettier (`.prettierrc`) is canonical:

- 4 spaces, no tabs
- single quotes and semicolons
- trailing commas: `all`
- print width: 100
- arrow parens: `always`
- line endings: LF
  Lint/format behavior:
- ESLint flat config uses JS + TS + React Hooks + React Refresh recommended rules.
- Tailwind classes are sorted by `prettier-plugin-tailwindcss`.
- Husky pre-commit hook runs `pnpm format`.
  TypeScript strictness from `tsconfig.app.json`:
- `strict`, `noImplicitAny`, `strictNullChecks`
- `noUnusedLocals`, `noUnusedParameters`
- `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`
- `moduleResolution: bundler`, `verbatimModuleSyntax: true`
- `erasableSyntaxOnly: true`
  Typing rules:
- Never add explicit `any`.
- Prefer `unknown` + narrowing at trust boundaries.
- Keep assertions minimal and justified.
- Use Zod for runtime validation.

## Naming, error handling, and security

Naming conventions:

- Directories: `kebab-case` (usually singular)
- Non-component files: `kebab-case.ts`
- React component files: `PascalCase.tsx`
- Types/interfaces: `PascalCase`
- Functions/variables: `camelCase`
- Constants (maps/objects): `UPPER_SNAKE_CASE`
- Component function names should match filenames
  Prefer action-oriented function names (`get`, `set`, `create`, `parse`, `normalize`, `is`, `handle`).
  Error/API rules:
- Use shared HTTP abstractions from `src/shared/api/http/`.
- Normalize transport failures with `normalizeApiError()`.
- Keep failures aligned to the shared `ApiError` shape.
- Parse untrusted payloads with `parseWithSchema()`.
  Auth/security rules:
- Keep JWT attach/refresh/retry/logout logic centralized.
- Preserve single-flight refresh behavior and bounded retries.
- On unrecoverable refresh failure, clear session state safely.
- Keep auth/role guard logic centralized in `src/app/guards/`.
- Never log or expose access/refresh tokens.
  UI/shared rules:
- `src/shared/ui/` must remain domain-agnostic and reusable.
- Use `cn()` for class merging.
- Use CVA for variant APIs when it improves clarity.
- Do not place business workflows in shared UI primitives.

## Testing policy

- Tests live in root `test/`, mirroring `src/`.
- Unit tests: `test/unit/`; integration tests: `test/integration/`.
- Use MSW (`test/msw/handlers/`, `test/msw/fixtures/`) for API mocking.
- `test/setup.ts` uses `onUnhandledRequest: 'error'`.
- Prefer behavior-focused tests over implementation-detail tests.
- Meaningful logic changes should include test updates.

## Copilot/agent alignment and dependency policy

Rules in `.github/copilot-instructions.md` and `.github/agents/*.agent.md` reinforce:

- strict FSD boundaries and public API encapsulation
- thin pages and functional composition
- centralized auth/session behavior and role protection
- reusable shared UI and accessibility
- maintainable MSW-backed tests and architecture-aware review
  Use those files for task-specific depth, but do not violate this file.
  Dependency policy:
- Avoid adding dependencies unless there is clear architectural value.
- Reuse existing patterns/utilities before introducing alternatives.
- Keep changes focused, reviewable, and consistent with FSD and security constraints.
