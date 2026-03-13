# Architecture

Viteplate is built on [Feature-Sliced Design](https://feature-sliced.design/) (FSD), an architectural methodology that organizes frontend code into layers, slices, and segments. This document covers the structural rules, naming conventions, and patterns that govern the codebase.

---

## Table of Contents

- [Layer Hierarchy](#layer-hierarchy)
- [Dependency Rule](#dependency-rule)
- [Directory Structure](#directory-structure)
- [Layer Responsibilities](#layer-responsibilities)
- [Segments](#segments)
- [Public API Convention](#public-api-convention)
- [Path Aliases](#path-aliases)
- [Import Conventions](#import-conventions)
- [Naming Conventions](#naming-conventions)
- [Formatting Standards](#formatting-standards)

---

## Layer Hierarchy

FSD organizes code into six layers, ordered from most application-specific (top) to most generic (bottom):

```
app  -->  pages  -->  widgets  -->  features  -->  entities  -->  shared
```

Each layer has a well-defined responsibility. Code within a layer is organized into **slices** (domain-specific groupings), and each slice is divided into **segments** (technical concerns like `api/`, `model/`, `ui/`).

---

## Dependency Rule

The single most important rule in FSD:

> **A module may only import from layers below it, never from layers above or from sibling slices at the same layer.**

| Layer      | May Import From                            |
| ---------- | ------------------------------------------ |
| `app`      | pages, widgets, features, entities, shared |
| `pages`    | widgets, features, entities, shared        |
| `widgets`  | features, entities, shared                 |
| `features` | entities, shared                           |
| `entities` | shared                                     |
| `shared`   | External packages only                     |

Cross-slice imports at the same layer are prohibited. If two features need to share logic, that logic belongs in `entities` or `shared`.

---

## Directory Structure

```
src/
├── app/                            # Application bootstrap layer
│   ├── App.tsx                     # Root component
│   ├── guards/                     # Route guards
│   │   ├── auth-guard.ts           # Requires authentication
│   │   ├── guest-guard.ts          # Requires unauthenticated state
│   │   └── role-guard.ts           # Requires specific role(s)
│   ├── layouts/                    # Route layout wrappers
│   │   ├── PublicLayout.tsx        # Unauthenticated pages
│   │   └── ProtectedLayout.tsx     # Authenticated pages
│   ├── providers/                  # Context providers
│   │   ├── theme/                  # Theme context and hook
│   │   ├── query/                  # TanStack Query provider and config
│   │   └── router/                 # TanStack Router provider
│   ├── routers/                    # Route tree and router context type
│   └── styles/                     # Global CSS (modular)
│       ├── index.css               # Aggregator imports
│       ├── theme.css               # Tokens and @theme mapping
│       ├── base.css                # Base styles and transitions
│       └── components/             # Component-scoped CSS modules
│
├── pages/                          # Route-level compositions
│   ├── home/                       # HomePage.tsx
│   ├── about/                      # AboutPage.tsx
│   ├── stack/                      # StackPage.tsx
│   ├── login/                      # LoginPage.tsx
│   ├── dashboard/                  # DashboardPage.tsx
│   ├── admin/                      # AdminDashboardPage.tsx
│   ├── admin-settings/             # AdminSettingsPage.tsx
│   ├── viewer/                     # ViewerDashboardPage.tsx
│   ├── not-found/                  # NotFoundPage.tsx
│   └── unauthorized/               # UnauthorizedPage.tsx
│
├── widgets/                        # Reusable composed blocks
│   ├── navbar/                     # Navigation bar
│   │   ├── Navbar.tsx              # Component (public + auth variants)
│   │   ├── nav-config.ts           # Navigation item definitions
│   │   └── use-nav-items.ts        # Role-aware nav item hook
│   └── footer/                     # Site footer
│       └── Footer.tsx
│
├── features/                       # Business use cases
│   └── auth/
│       ├── login/                  # Login feature
│       │   ├── api/                # dto.ts, endpoint.ts
│       │   ├── model/              # use-login.ts, login-form-schema.ts
│       │   └── ui/                 # LoginForm.tsx
│       ├── logout/                 # Logout feature
│       │   ├── api/                # endpoint.ts
│       │   ├── model/              # use-logout.ts
│       │   └── ui/                 # LogoutButton or similar
│       └── refresh-session/        # Session refresh feature
│           └── model/              # use-refresh-session.ts
│
├── entities/                       # Domain models
│   ├── session/                    # Session state (Zustand store)
│   │   └── model/                  # store.ts, use-session.ts
│   └── user/                       # User domain
│       ├── model/                  # types.ts, schema.ts
│       └── api/                    # dto.ts, endpoints.ts, mappers.ts, queries.ts
│
├── shared/                         # Domain-agnostic infrastructure
│   ├── api/                        # HTTP client and error handling
│   │   ├── index.ts                # Public barrel
│   │   └── http/                   # Client, methods, interceptors, config
│   ├── config/                     # Environment and constants
│   │   ├── env.ts                  # Zod-validated env vars
│   │   └── constants.ts            # Route paths, API config, role mapping
│   ├── lib/                        # Utility functions
│   │   ├── cn.ts                   # clsx + tailwind-merge
│   │   ├── parse-with-schema.ts    # Zod parse wrapper
│   │   ├── theme.ts                # Theme utilities
│   │   └── animation-presets.ts    # Reusable motion configs
│   ├── types/                      # Shared type definitions
│   │   └── api-error.ts            # ApiError interface
│   └── ui/                         # Shared UI component library
│       ├── input/                  # Form and interactive primitives
│       ├── display/                # Data and content presentation
│       ├── feedback/               # Status and messaging components
│       ├── overlay/                # Dialogs, popovers, menus
│       ├── navigation/             # Breadcrumbs, pagination, stepper, links
│       └── layout/                 # Structural composition primitives
│
└── main.tsx                        # Entry point (outside app/)

test/
├── unit/                           # Unit tests (mirrors src/)
├── integration/                    # Integration tests (auth flows, guards)
├── msw/                            # MSW server, handlers, fixtures
│   ├── server.ts                   # Node MSW server
│   ├── browser.ts                  # Browser MSW worker
│   ├── handlers/                   # Request handlers
│   └── fixtures/                   # User fixture data
├── utils/                          # Test utilities
│   ├── render.tsx                  # renderApp() helper
│   ├── TestRouterSync.tsx          # Router sync for tests
│   └── reset-auth.ts              # Session reset helper
└── setup.ts                        # Global test setup (MSW server start)
```

---

## Layer Responsibilities

### `app`

The application shell. Responsible for:

- Mounting the root component (`App.tsx`)
- Configuring providers (theme, query, router)
- Defining route guards and layout wrappers
- Building the route tree
- Loading global styles

**Rules:** No business logic. No direct HTTP calls. Composes from lower layers.

### `pages`

Thin route-level compositions. Each page is a directory containing a single `*Page.tsx` component that assembles widgets, features, and shared UI into a complete view.

**Rules:** No direct HTTP calls. No complex logic. Compose and render only.

### `widgets`

Self-contained UI blocks that combine features, entities, and shared primitives. Widgets are reusable across pages.

**Examples:** Navbar (combines navigation config with session state and shared UI), Footer.

**Rules:** May contain local state and hooks. Must not contain business logic that belongs in a feature.

### `features`

Business use cases. Each feature encapsulates a complete user action.

**Structure:**

| Segment  | Purpose                        | Example                                |
| -------- | ------------------------------ | -------------------------------------- |
| `api/`   | DTOs and endpoint functions    | `login-dto.ts`, `endpoint.ts`          |
| `model/` | Hooks, schemas, business logic | `use-login.ts`, `login-form-schema.ts` |
| `ui/`    | Feature-specific components    | `LoginForm.tsx`                        |

**Rules:** May import from entities and shared. May not import from other features.

### `entities`

Domain concepts. Each entity encapsulates a domain model's types, schemas, API access, and optional UI.

**Structure:**

| Segment  | Purpose                           | Example                                  |
| -------- | --------------------------------- | ---------------------------------------- |
| `model/` | Types, stores, hooks              | `types.ts`, `store.ts`, `use-session.ts` |
| `api/`   | DTOs, endpoints, mappers, queries | `endpoints.ts`, `mappers.ts`             |

**Rules:** May only import from shared. May not import from other entities (entities at the same level are isolated from each other).

### `shared`

Domain-agnostic infrastructure. Everything here must work without knowledge of the specific application domain.

**Rules:** May only import from external packages. Never references features, entities, or any higher layer.

---

## Segments

Within each slice, code is organized into standard segments:

| Segment   | Contains                               | Typical Files                         |
| --------- | -------------------------------------- | ------------------------------------- |
| `api/`    | API endpoints, DTOs, mappers           | `endpoint.ts`, `dto.ts`, `mappers.ts` |
| `model/`  | Business logic, stores, hooks, schemas | `store.ts`, `use-*.ts`, `*-schema.ts` |
| `ui/`     | React components                       | `LoginForm.tsx`, `Navbar.tsx`         |
| `lib/`    | Pure utility functions                 | `cn.ts`, `parse-with-schema.ts`       |
| `types/`  | Type definitions                       | `api-error.ts`                        |
| `config/` | Configuration and constants            | `env.ts`, `constants.ts`              |

Not every slice needs every segment. Use only what the slice requires.

---

## Public API Convention

Every slice exposes its public interface through an `index.ts` barrel file at its root:

```typescript
// src/entities/session/index.ts
export { useSession } from './model/use-session';
export { sessionStore } from './model/store';
```

**Rules:**

- Value exports and type exports are separated:
    ```typescript
    export { httpClient } from './http/client';
    export type { ApiError } from './types/api-error';
    ```
- Only symbols that external consumers need are exported.
- Internal implementation details stay private (not re-exported).
- External consumers must import through the barrel, never via deep paths.

---

## Path Aliases

Six aliases map to the FSD layers:

| Alias         | Resolves To      |
| ------------- | ---------------- |
| `@app/*`      | `src/app/*`      |
| `@pages/*`    | `src/pages/*`    |
| `@widgets/*`  | `src/widgets/*`  |
| `@features/*` | `src/features/*` |
| `@entities/*` | `src/entities/*` |
| `@shared/*`   | `src/shared/*`   |

Aliases are defined in `tsconfig.app.json` and mirrored in `vite.config.ts`.

**Usage:**

- **Cross-slice imports:** Always use aliases. `import { httpClient } from '@shared/api'`
- **Same-slice imports:** Use relative paths. `import { store } from './store'`

---

## Import Conventions

1. **Order:** Third-party packages, then alias imports, then relative imports. Types after values in each group.
2. **Type-only imports:** Always use `import type { ... }` for types. Enforced by `verbatimModuleSyntax: true`.
3. **No default exports.** Every export must be named.

```typescript
// Correct import ordering
import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@shared/api';
import { sessionStore } from './store';
import type { User } from '@entities/user';
import type { SessionState } from './types';
```

---

## Naming Conventions

| Element            | Convention                      | Examples                                           |
| ------------------ | ------------------------------- | -------------------------------------------------- |
| Logic files        | `kebab-case.ts`                 | `session-adapter.ts`, `normalize-api-error.ts`     |
| Component files    | `PascalCase.tsx`                | `LoginForm.tsx`, `Navbar.tsx`                      |
| Directories        | `kebab-case`, singular          | `auth/`, `session/`, `shared/`                     |
| Types / Interfaces | `PascalCase`                    | `ApiError`, `SessionAdapter`                       |
| Functions          | `camelCase` with action prefix  | `createRefreshController()`, `normalizeApiError()` |
| Constants          | `UPPER_SNAKE_CASE`              | `API_CONFIG`, `ROUTE_PATHS`, `AUTH_ENDPOINTS`      |
| React components   | `PascalCase` matching file name | `Button`, `LoginForm`, `PublicLayout`              |
| Hooks              | `camelCase` with `use` prefix   | `useSession`, `useLogin`, `useTheme`               |

### Action Prefixes

Functions use descriptive action prefixes to communicate intent:

| Prefix       | Meaning                    | Example                     |
| ------------ | -------------------------- | --------------------------- |
| `create*`    | Factory or constructor     | `createRefreshController()` |
| `get*`       | Retrieve a value           | `getRoleHomePath()`         |
| `set*`       | Store a value              | `setAccessToken()`          |
| `clear*`     | Remove/reset state         | `clearSession()`            |
| `reset*`     | Restore to initial state   | `resetAuth()`               |
| `parse*`     | Parse and validate         | `parseWithSchema()`         |
| `normalize*` | Transform to standard form | `normalizeApiError()`       |
| `handle*`    | Event/response handler     | `handleLogout()`            |
| `is*`        | Boolean predicate          | `isAuthenticated()`         |

---

## Formatting Standards

Formatting is handled by Prettier with the following configuration:

| Setting                | Value                |
| ---------------------- | -------------------- |
| Indentation            | 4 spaces             |
| Quotes                 | Single               |
| Semicolons             | Yes                  |
| Trailing commas        | All                  |
| Print width            | 100 characters       |
| Line endings           | LF                   |
| Arrow function params  | Always parenthesized |
| Tailwind class sorting | Enabled (via plugin) |

A pre-commit hook automatically runs `pnpm format` on staged files via Husky and lint-staged.
