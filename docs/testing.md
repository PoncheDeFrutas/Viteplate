# Testing

Viteplate uses Vitest with Testing Library and MSW for a comprehensive testing strategy. Tests live in a dedicated `test/` directory that mirrors the `src/` structure.

---

## Table of Contents

- [Overview](#overview)
- [Configuration](#configuration)
- [Directory Structure](#directory-structure)
- [MSW (Mock Service Worker)](#msw-mock-service-worker)
- [Test Utilities](#test-utilities)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [Patterns and Best Practices](#patterns-and-best-practices)

---

## Overview

| Tool                         | Version | Purpose                              |
| ---------------------------- | ------- | ------------------------------------ |
| Vitest                       | 4.0     | Test runner and assertion library    |
| Testing Library (React)      | 16.3    | Component rendering and queries      |
| Testing Library (user-event) | 14.6    | Simulating user interactions         |
| Testing Library (jest-dom)   | 6.9     | DOM-specific matchers                |
| MSW                          | 2.12    | API request interception and mocking |
| jsdom                        | 28.1    | Browser environment simulation       |

---

## Configuration

### Vitest Config

Testing is configured in `vite.config.ts`:

```typescript
test: {
    globals: true,           // No need to import describe/it/expect
    environment: 'jsdom',    // Browser-like DOM environment
    setupFiles: './test/setup.ts',
}
```

### Global Setup

**File:** `test/setup.ts`

The setup file runs before all tests and:

1. Imports `@testing-library/jest-dom` matchers (e.g., `toBeInTheDocument()`)
2. Starts the MSW server with `onUnhandledRequest: 'error'`
3. Resets handlers after each test
4. Closes the server after all tests

```typescript
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

The `onUnhandledRequest: 'error'` setting ensures that any API request not handled by MSW causes the test to fail -- preventing accidental real network requests.

---

## Directory Structure

```
test/
├── setup.ts                    # Global test setup (MSW server lifecycle)
├── unit/                       # Unit tests
│   └── shared/
│       └── api/
│           └── http/
│               └── client.test.ts
├── integration/                # Integration tests
│   └── auth/
│       ├── login.test.tsx
│       ├── logout.test.tsx
│       ├── guards.test.tsx
│       └── refresh-session.test.tsx
├── msw/                        # MSW configuration
│   ├── index.ts                # Barrel export (server + handlers)
│   ├── server.ts               # Node MSW server instance
│   ├── browser.ts              # Browser MSW worker (for dev mode)
│   ├── handlers/
│   │   ├── index.ts            # Handler barrel
│   │   ├── auth.ts             # Auth endpoint handlers
│   │   └── user.ts             # User endpoint handlers
│   └── fixtures/
│       └── users.ts            # User fixture data
└── utils/                      # Test utilities
    ├── render.tsx              # renderApp() helper
    ├── TestRouterSync.tsx      # Router sync component for tests
    └── reset-auth.ts           # Session state reset helper
```

---

## MSW (Mock Service Worker)

MSW intercepts HTTP requests at the network level and returns mock responses. This provides realistic API mocking without modifying application code.

### Server Setup

**File:** `test/msw/server.ts`

```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### Handlers

Handlers define mock API endpoints. They use in-memory state to simulate a real backend.

**File:** `test/msw/handlers/auth.ts`

The auth handlers simulate:

- `POST /auth/login` -- Validates credentials against fixture data, returns tokens
- `POST /auth/refresh` -- Simulates token refresh using in-memory session state
- `POST /auth/logout` -- Clears the mock session

**File:** `test/msw/handlers/user.ts`

- `GET /users/me` -- Returns the currently authenticated user

### Fixtures

**File:** `test/msw/fixtures/users.ts`

Three user fixtures cover all roles:

| Fixture             | Email                  | Role     | Password    |
| ------------------- | ---------------------- | -------- | ----------- |
| `MOCK_ADMIN_USER`   | `admin@viteplate.dev`  | `admin`  | `admin123`  |
| `MOCK_REGULAR_USER` | `user@viteplate.dev`   | `user`   | `user123`   |
| `MOCK_VIEWER_USER`  | `viewer@viteplate.dev` | `viewer` | `viewer123` |

### Handler State

Auth handlers maintain in-memory state (authenticated user, token validity) that persists within a test but resets between tests via `server.resetHandlers()` and the `resetAuth()` utility.

---

## Test Utilities

### `renderApp()`

**File:** `test/utils/render.tsx`

Renders the full application with all providers (theme, query, router) and navigates to a specified route:

```typescript
import { renderApp } from '../../utils/render';

await renderApp('/dashboard');
```

This is the primary way to render components in integration tests. It provides:

- `ThemeProvider`
- `QueryClientProvider` (fresh client per test)
- `RouterProvider` with the full route tree
- Navigation to the specified initial route

### `resetAuth()`

**File:** `test/utils/reset-auth.ts`

Clears the session store between tests to ensure a clean state:

```typescript
import { resetAuth } from '../../utils/reset-auth';

afterEach(() => {
    resetAuth();
});
```

### `TestRouterSync`

**File:** `test/utils/TestRouterSync.tsx`

A helper component that synchronizes the TanStack Router with the test environment, ensuring route changes are properly tracked.

---

## Writing Tests

### Integration Test Example: Login

```typescript
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '../../utils/render';
import { resetAuth } from '../../utils/reset-auth';

describe('Login', () => {
    afterEach(() => {
        resetAuth();
    });

    it('shows the login form', async () => {
        await renderApp('/login');

        expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('logs in with valid credentials and redirects', async () => {
        const user = userEvent.setup();
        await renderApp('/login');

        await user.type(screen.getByLabelText(/email/i), 'admin@viteplate.dev');
        await user.type(screen.getByLabelText(/password/i), 'admin123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
        });
    });
});
```

### Guard Test Example

```typescript
it('redirects unauthenticated user from /dashboard to /login', async () => {
    await renderApp('/dashboard');

    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    });
});
```

---

## Running Tests

| Command                                   | Description                                 |
| ----------------------------------------- | ------------------------------------------- |
| `pnpm test`                               | Run in watch mode (re-runs on file changes) |
| `pnpm test -- --run`                      | Run once and exit                           |
| `pnpm test -- --run path/to/file.test.ts` | Run a single file                           |
| `pnpm test -- --run -t "pattern"`         | Run tests matching a name                   |
| `pnpm test:coverage`                      | Run with coverage reporting                 |

### Current Test Suite

21 tests across 4 files:

| File                                        | Tests | Coverage                                                 |
| ------------------------------------------- | ----- | -------------------------------------------------------- |
| `integration/auth/login.test.tsx`           | 5     | Login form, validation, successful login, error handling |
| `integration/auth/logout.test.tsx`          | 1     | Logout clears session and redirects                      |
| `integration/auth/guards.test.tsx`          | 13    | Auth guard, guest guard, role guard for all roles        |
| `integration/auth/refresh-session.test.tsx` | 2     | Session recovery on boot                                 |

---

## Patterns and Best Practices

### General Rules

| Rule                                    | Description                                             |
| --------------------------------------- | ------------------------------------------------------- |
| Use `renderApp()` for integration tests | Ensures full provider tree is available                 |
| Reset state between tests               | Always call `resetAuth()` in `afterEach`                |
| Use `waitFor` for async assertions      | Route changes and API calls are async                   |
| Query by accessible roles               | Prefer `getByRole`, `getByLabelText` over `getByTestId` |
| Test behavior, not implementation       | Assert on visible outcomes, not internal state          |

### MSW Rules

| Rule                                   | Description                                      |
| -------------------------------------- | ------------------------------------------------ |
| `onUnhandledRequest: 'error'`          | Every API call in tests must have a handler      |
| Reset handlers after each test         | `server.resetHandlers()` in setup.ts             |
| Use fixtures for consistent data       | Avoids magic strings scattered across tests      |
| Override handlers per-test when needed | `server.use(http.post(...))` for error scenarios |

### Heading Assertions

Several tests assert on page headings to verify correct routing. These are critical and must not change:

| Pattern              | Page                | Element           |
| -------------------- | ------------------- | ----------------- |
| `/sign in/i`         | LoginPage           | `<h1>`            |
| `/admin dashboard/i` | AdminDashboardPage  | `<h1>`            |
| `/^dashboard$/i`     | DashboardPage       | `<h1>` (anchored) |
| `/overview/i`        | ViewerDashboardPage | `<h1>`            |
| `/unauthorized/i`    | UnauthorizedPage    | `<h1>`            |
| `/viteplate/i`       | HomePage            | `<h1>`            |

Changing these headings will break the test suite.
