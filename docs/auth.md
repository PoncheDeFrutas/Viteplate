# Authentication System

Viteplate includes a complete JWT-based authentication system with token refresh, role-based access control, and route guards. This document covers every component of the auth flow.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Session Store](#session-store)
- [Session Adapter](#session-adapter)
- [Login Flow](#login-flow)
- [Token Refresh Flow](#token-refresh-flow)
- [Logout Flow](#logout-flow)
- [Session Recovery on Boot](#session-recovery-on-boot)
- [Route Guards](#route-guards)
- [Role-Based Access Control](#role-based-access-control)
- [Security Considerations](#security-considerations)

---

## Architecture Overview

The auth system spans multiple FSD layers:

| Layer      | Slice                   | Responsibility                                         |
| ---------- | ----------------------- | ------------------------------------------------------ |
| `shared`   | `api/http/`             | Token attachment, 401 interception, refresh controller |
| `entities` | `session/`              | Session state (Zustand store)                          |
| `entities` | `user/`                 | User types, schemas, API mappers                       |
| `features` | `auth/login/`           | Login endpoint, form, mutation hook                    |
| `features` | `auth/logout/`          | Logout endpoint, mutation hook                         |
| `features` | `auth/refresh-session/` | Refresh endpoint, recovery hook                        |
| `app`      | `guards/`               | Auth guard, guest guard, role guard                    |

```
┌─────────────────────────────────────────────────────────┐
│                     App Layer                           │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐     │
│  │ authGuard  │  │ guestGuard  │  │ roleGuard    │     │
│  └─────┬──────┘  └──────┬──────┘  └──────┬───────┘     │
│        │                │                │              │
│        └────────────────┼────────────────┘              │
│                         │                               │
├─────────────────────────┼───────────────────────────────┤
│               Features Layer                            │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────┐    │
│  │  login/  │  │  logout/   │  │ refresh-session/ │    │
│  └────┬─────┘  └─────┬──────┘  └────────┬─────────┘    │
│       │               │                  │              │
├───────┼───────────────┼──────────────────┼──────────────┤
│              Entities Layer                              │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │   session/   │  │    user/     │                     │
│  │  (Zustand)   │  │  (types +   │                     │
│  │              │  │   schema)   │                     │
│  └──────┬───────┘  └──────┬──────┘                     │
│         │                 │                             │
├─────────┼─────────────────┼─────────────────────────────┤
│                Shared Layer                              │
│  ┌──────────────────────────────────────────────┐       │
│  │  api/http/                                   │       │
│  │  ├── session-adapter.ts   (token bridge)     │       │
│  │  ├── refresh-controller.ts (single-flight)   │       │
│  │  ├── interceptors/request-auth.ts            │       │
│  │  └── interceptors/response-auth.ts           │       │
│  └──────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

---

## Session Store

**File:** `src/entities/session/model/store.ts`

The session store is a Zustand **vanilla store** (not a React hook store) that holds the current session state in memory. It is never persisted to `localStorage` or `sessionStorage`.

### State Shape

| Property      | Type             | Description                |
| ------------- | ---------------- | -------------------------- |
| `accessToken` | `string \| null` | Current JWT access token   |
| `user`        | `User \| null`   | Current authenticated user |

### Actions

| Action            | Signature                   | Description                                  |
| ----------------- | --------------------------- | -------------------------------------------- |
| `setAccessToken`  | `(token: string) => void`   | Store a new access token                     |
| `setUser`         | `(user: User) => void`      | Store the authenticated user                 |
| `clearSession`    | `(reason: string) => void`  | Clear all session state (logs reason in DEV) |
| `isAuthenticated` | `() => boolean`             | Check if an access token exists              |
| `hasRole`         | `(role: string) => boolean` | Check if the user has a specific role        |

### Access Hook

**File:** `src/entities/session/model/use-session.ts`

The `useSession` hook provides reactive access to the store from React components:

```typescript
import { useSession } from '@entities/session';

// Read user
const user = useSession((s) => s.user);

// Check role
const isAdmin = useSession((s) => s.hasRole('admin'));
```

---

## Session Adapter

**File:** `src/shared/api/http/session-adapter.ts`

The session adapter is a **bridge** between the Zustand session store (in `entities/`) and the HTTP interceptors (in `shared/`). This respects the FSD dependency rule -- `shared/` cannot import from `entities/`, so the adapter provides pluggable token access functions.

| Method                  | Description                                                                      |
| ----------------------- | -------------------------------------------------------------------------------- |
| `getAccessToken()`      | Retrieves the current access token from the session store                        |
| `setAccessToken(token)` | Stores a new access token in the session store                                   |
| `getRefreshToken()`     | Returns the sentinel string `"httponly"` (actual token is in an httpOnly cookie) |
| `clearSession()`        | Clears all session state via the store                                           |

The adapter is injected into interceptors and the refresh controller at initialization time.

---

## Login Flow

```
User submits credentials
  |
  v
LoginForm (features/auth/login/ui)
  |
  v
useLogin mutation hook (features/auth/login/model)
  |
  v
loginEndpoint(dto) with skipAuth: true (features/auth/login/api)
  |
  v
POST /auth/login  -->  Server returns { accessToken, user }
  |
  v
sessionStore.setAccessToken(token)
sessionStore.setUser(user)
  |
  v
navigate to getRoleHomePath(user.role)
```

### Key Files

| File                                             | Responsibility                                      |
| ------------------------------------------------ | --------------------------------------------------- |
| `features/auth/login/ui/LoginForm.tsx`           | Form component using TanStack Form + Zod validation |
| `features/auth/login/model/use-login.ts`         | TanStack Query mutation hook                        |
| `features/auth/login/model/login-form-schema.ts` | Zod schema for form validation                      |
| `features/auth/login/api/endpoint.ts`            | API call to `/auth/login`                           |
| `features/auth/login/api/dto.ts`                 | Request/response DTOs                               |

---

## Token Refresh Flow

**File:** `src/shared/api/http/refresh-controller.ts`

The refresh controller implements **single-flight refresh** -- if multiple requests fail with 401 simultaneously, only one refresh request is sent. All other requests are queued and replayed once the refresh completes.

```
Request fails with 401
  |
  v
Response interceptor catches 401
  |
  v
Is a refresh already in progress?
  |
  ├── Yes  -->  Queue this request, wait for refresh result
  │
  └── No   -->  Start refresh
                  |
                  v
                POST /auth/refresh (with httpOnly cookie)
                  |
                  ├── Success  -->  Store new access token
                  │                 Replay this request + all queued requests
                  │
                  └── Failure  -->  Retry count < 2?
                                    |
                                    ├── Yes  -->  Retry refresh
                                    └── No   -->  Force logout
                                                  Clear session
                                                  Reject all queued requests
```

### Retry Policy

| Setting             | Value                                               |
| ------------------- | --------------------------------------------------- |
| Max refresh retries | 2                                                   |
| On final failure    | Forced logout (session cleared, redirect to /login) |
| Concurrent handling | Single-flight (one refresh, others queued)          |

---

## Logout Flow

```
User clicks logout
  |
  v
useLogout mutation hook (features/auth/logout/model)
  |
  v
logoutEndpoint() (features/auth/logout/api)
  |
  v
POST /auth/logout  -->  Server invalidates refresh token
  |
  v
sessionStore.clearSession('user-logout')
  |
  v
navigate to /login
```

Logout always clears the client session regardless of whether the server request succeeds.

---

## Session Recovery on Boot

**File:** `src/features/auth/refresh-session/model/use-refresh-session.ts`

When the application loads, `App.tsx` calls `useRefreshSession` to attempt session recovery before rendering the router. This handles the case where the user still has a valid httpOnly refresh cookie from a previous session.

```
App mounts
  |
  v
useRefreshSession()
  |
  v
POST /auth/refresh (with httpOnly cookie)
  |
  ├── Success  -->  Store access token + user, render router
  └── Failure  -->  Render router (user is unauthenticated)
```

This ensures that refreshing the browser does not lose the session if the refresh token is still valid.

---

## Route Guards

Guards run in TanStack Router's `beforeLoad` hook before a route renders.

### `authGuard`

**Purpose:** Require authentication.
**Behavior:** If `isAuthenticated()` returns false, redirect to `/login`.
**Used by:** Protected layout route (applies to all authenticated routes).

### `guestGuard`

**Purpose:** Require unauthenticated state.
**Behavior:** If `isAuthenticated()` returns true, redirect to `getRoleHomePath(user.role)`.
**Used by:** Login page, home page.

### `createRoleGuard(...roles)`

**Purpose:** Require specific role(s).
**Behavior:** If the user's role is not in the allowed list, redirect to `/unauthorized`.
**Used by:** Admin routes (`admin`), dashboard route (`user`), overview route (`viewer`).

---

## Role-Based Access Control

Three roles are supported:

| Role     | Home Route   | Accessible Routes           |
| -------- | ------------ | --------------------------- |
| `admin`  | `/admin`     | `/admin`, `/admin/settings` |
| `user`   | `/dashboard` | `/dashboard`                |
| `viewer` | `/overview`  | `/overview`                 |

Role-to-home-path mapping is defined in `src/shared/config/constants.ts` via `getRoleHomePath()`.

The `Navbar` widget uses `useNavItems()` to show role-appropriate navigation links.

---

## Security Considerations

| Concern                 | Approach                                                               |
| ----------------------- | ---------------------------------------------------------------------- |
| Access token storage    | In-memory only (Zustand store, never persisted)                        |
| Refresh token storage   | httpOnly cookie (inaccessible to JavaScript)                           |
| Token in requests       | `Authorization: Bearer <token>` header                                 |
| Token in logs           | Never logged (tokens excluded from debug output)                       |
| Session clearing        | `clearSession(reason)` wipes all state atomically                      |
| Refresh race conditions | Single-flight controller prevents duplicate refresh requests           |
| Retry limits            | Max 2 refresh retries before forced logout                             |
| Route protection        | Guards run before route load, preventing flash of unauthorized content |
