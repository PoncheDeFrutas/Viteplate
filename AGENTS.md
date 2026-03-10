# AGENTS.md

## Repository purpose

This repository is a frontend starter template for scalable React applications using Feature-Sliced Design (FSD). It provides a structured foundation for building complex applications while maintaining modularity and separation of concerns.

It is designed to serve as both:

- A reusable production-ready frontend foundation
- A living architectural reference for a scalable, typed, secure, and maintainable applications

Every change must preserve the repository's role as a reusable template and architecture guide.

---

## Official stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Tanstack Query
- Tanstack Router
- Tanstack Form
- Axios
- Zod
- Zustand
- Vitest
- MSW
- ESLint
- Prettier
- Husky

Package manager: `pnpm`

---

## Core architectural model

This project follows Feature-Sliced Design (FSD).

Dependency direction must always be respected:

`app -> pages -> widgets -> features -> entities -> shared`

Rules:

- Import only downward in the dependency graph.
- Never import upward.
- Never bypass another slice's public API for cross-slice imports.
- Use `index.ts` as the public API entrypoint for imports that cross slice boundaries.
- Do not create or keep `index.ts` files that add no architectural value.
- Keep responsibilities explicit and local to the proper layer.
- Prefer scalable composition over ad hoc coupling.

---

## Layer responsibilities

### app

Contains the application bootstrap and global integration only:

- providers
- router setup
- router guards
- app-wide initialization
- global error handling

Must not contain business domain logic, UI components, or feature-specific code.

### pages

Contains route-level UI composition.

Pages should:

- assemble widgets, features, entities, and shared UI
- define layout and route-facing composition
- stay thin

Pages must not:

- perform direct HTTP calls
- implement auth rules directly when route guards can be handled them
- contain complex business logic that belongs in features or entities

### widgets

Contains reusable compositions of features, entities, and shared UI.
Widgets orchestrate UI, but should not own core domain rules.

### Features

Contains business use cases and user actions.

Examples:

- login
- logout
- refresh-session
- search
- toggle-theme

A feature may include:

- api
- model
- ui
- lib

### Entities

Contains domain concepts and reusable domain logic.

Examples:

- user
- session

An entity may include:

- api
- model
- ui

Only include layers that are actually needed.

### Shared

Contains domain-agnostic reusable infrastructure:

- HTTP client
- API utilities
- generic hooks
- reusable UI components (buttons, inputs, etc.)
- config
- utility functions

Shared must remain domain-agnostic.

---

## Authentication and authorization rules

This template assumes JWT-based authentication and role-based authorization.

The architecture must support:

- login
- logout
- refresh token flow
- current user retrieval through a `me` endpoint
- protected routes
- role-based access control
- token expiration handling

Rules:

- Access tokens must be treated as expirable.
- Refresh flow must be considered part of the official auth lifecycle.
- The HTTP client must support authenticated requests and token lifecycle handling.
- Role-based authorization must be enforced consistently.
- A user without the required role must not be able to access protected pages or privileged UI flows.
- Auth logic must not be scattered arbitrarily across the codebase.
- Logout must clear auth-related state safely.
- Avoid insecure token handling patterns.

When implementing auth-related changes:

- keep transport concerns separate from domain/session concerns
- keep route protection logic explicit
- keep role checks maintainable and testable

---

## API and HTTP client rules

- Use the established Axios client abstraction.
- Do not create ad hoc HTTP clients without strong justification.
- API contracts must be typed.
- Use Zod where runtime validation is needed.
- Keep DTOs separate from domain models when both concepts exist.
- Prefer explicit mapping over leaking raw transport shapes into UI.
- Avoid duplicating auth header logic across calls.
- Centralize token-aware request behavior in the HTTP client layer or approved abstractions.
- Query logic must align with TanStack Query best practices.

---

## UI architecture rules

Reusable UI must be structured intentionally.

Rules:

- Shared UI must remain domain-agnostic.
- Reusable UI should be grouped by responsibility.
- Prefer separating primitives by kind, such as:
    - input
    - display
    - feedback
    - overlay
    - layout
    - navigation
- Prefer composition and explicit variants over large all-purpose components.
- Use Tailwind CSS, CVA, clsx, and tailwind-merge consistently.
- Prioritize accessibility, reusability, and predictable APIs.
- Do not place business workflows inside shared UI primitives.

---

## Coding standards

- Use strict TypeScript.
- Do not use explicit `any`.
- Prefer `unknown` over `any` where needed.
- Avoid unsafe assertions unless clearly justified.
- Keep functions and components small and cohesive.
- Follow repository naming conventions.
- Prefer explicit, narrow, validated types.
- Do not introduce architectural shortcuts that reduce long-term maintainability.

---

## Dependency policy

- Do not add new dependencies unless clearly necessary.
- Prefer the existing stack and utilities.
- Dependency changes must be justified by architectural value and maintenance cost.
- Do not replace core technologies unless explicitly requested.

---

## Testing strategy

This repository uses a root-level testing structure.

Tests must live under the root `test/` directory.

The official testing approach includes:

- unit tests
- integration tests where appropriate
- MSW-based API mocking
- auth and protected-route coverage when relevant

Rules:

- MSW is the default strategy for request mocking in tests and development scenarios where appropriate.
- Auth flows such as login, logout, refresh, and `me` should be testable.
- Protected route behavior and role-based access rules should be testable.
- Critical business logic changes should include or update tests.
- Test utilities and fixtures should remain reusable and maintainable.

---

## Validation requirements

When relevant, validate changes with:

- `pnpm lint`
- `pnpm check-types`
- `pnpm build`
- `pnpm test`

If a meaningful logic change is made without adding or updating tests, the reason must be stated explicitly.

---

## Expected behavior for AI agents

All AI agents working in this repository must:

- preserve FSD boundaries
- respect the public API of slices
- avoid unnecessary refactors
- avoid adding dependencies unless explicitly justified
- avoid explicit `any`
- preserve the repository's auth and role-based access model
- keep changes minimal, reviewable, and scalable
- align with the repository's long-term growth strategy
- follow secure and maintainable patterns by default

If a request conflicts with the repository architecture, security model, or auth model, prefer the established rules unless explicitly instructed otherwise.
