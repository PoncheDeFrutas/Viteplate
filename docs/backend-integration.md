# Backend Integration Guide

This guide explains what a backend must provide so Viteplate can authenticate users, refresh sessions, and fetch user data correctly.

Use this as a contract between frontend and backend teams.

---

## Table of Contents

- [Integration Checklist](#integration-checklist)
- [Base Configuration](#base-configuration)
- [Required Endpoints](#required-endpoints)
- [Data Contracts](#data-contracts)
- [Authentication Lifecycle](#authentication-lifecycle)
- [CORS and Cookies](#cors-and-cookies)
- [Error Contract](#error-contract)
- [Role Requirements](#role-requirements)
- [Local Development Tips](#local-development-tips)

---

## Integration Checklist

Your backend is ready for this frontend when all items below are true:

1. Exposes `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`, and `GET /users/me`
2. Accepts and returns JSON payloads matching the schemas in this guide
3. Uses cookie-based refresh (`httpOnly` cookie) and returns access token in JSON
4. Accepts `Authorization: Bearer <accessToken>` for protected routes
5. Enables CORS with credentials for the frontend origin
6. Returns stable HTTP status codes (`401`, `403`, `422`, etc.)
7. Returns role in user payload (`admin` | `user` | `viewer`)

---

## Base Configuration

The frontend sends requests using:

- Base URL: `VITE_API_BASE_URL` (e.g. `http://localhost:3000`)
- Default timeout: `10_000ms`
- Default headers:
    - `Content-Type: application/json`
    - `Accept: application/json`
- Credentials mode: `withCredentials: true`

Why credentials are required: refresh token is expected to live in an `httpOnly` cookie.

---

## Required Endpoints

### `POST /auth/login`

- Purpose: authenticate user with email/password
- Auth header: not required
- Body:

```json
{
    "email": "admin@example.com",
    "password": "secret"
}
```

- Success response (`200`):

```json
{
    "accessToken": "jwt-access-token",
    "refreshToken": "refresh-token-or-placeholder",
    "user": {
        "id": "u_1",
        "email": "admin@example.com",
        "name": "Admin User",
        "role": "admin",
        "created_at": "2026-01-01T12:00:00.000Z",
        "updated_at": "2026-01-01T12:00:00.000Z"
    }
}
```

Also set refresh cookie (recommended):

- `Set-Cookie: refreshToken=...; HttpOnly; Path=/; SameSite=Lax|None; Secure?`

### `POST /auth/refresh`

- Purpose: rotate/refresh tokens using refresh cookie
- Auth header: not required (`skipAuth` is used)
- Body: none
- Cookie: required (`httpOnly` refresh cookie)
- Success response (`200`):

```json
{
    "accessToken": "new-jwt-access-token",
    "refreshToken": "new-refresh-token-or-placeholder"
}
```

### `POST /auth/logout`

- Purpose: invalidate refresh session
- Body: none
- Cookie: included via credentials
- Success response (`200`):

```json
{
    "success": true
}
```

Recommended: clear refresh cookie server-side.

### `GET /users/me`

- Purpose: fetch current authenticated user
- Auth header: required
- Success response (`200`):

```json
{
    "id": "u_1",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "created_at": "2026-01-01T12:00:00.000Z",
    "updated_at": "2026-01-01T12:00:00.000Z"
}
```

---

## Data Contracts

These are validated in frontend Zod schemas.

### Login request

```ts
{
    email: string; // valid email format
    password: string; // non-empty
}
```

### Login/refresh response

```ts
{
    accessToken: string;
    refreshToken: string;
}
```

### User response (`/users/me`)

```ts
{
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user' | 'viewer';
    created_at: string; // ISO datetime
    updated_at: string; // ISO datetime
}
```

Important: field names must be snake_case for timestamps (`created_at`, `updated_at`).

---

## Authentication Lifecycle

1. User logs in via `POST /auth/login`
2. Frontend stores `accessToken` in memory (Zustand), not localStorage
3. Frontend sends `Authorization: Bearer <accessToken>` on protected requests
4. On `401`, frontend runs single-flight refresh via `POST /auth/refresh`
5. If refresh succeeds, original request is replayed automatically
6. If refresh fails repeatedly, frontend clears session and redirects to `/login`

---

## CORS and Cookies

For cross-origin local dev (example frontend `http://localhost:5173`, backend `http://localhost:3000`):

- `Access-Control-Allow-Origin: http://localhost:5173`
- `Access-Control-Allow-Credentials: true`
- Allow methods: `GET, POST, PATCH, PUT, DELETE, OPTIONS`
- Allow headers: `Content-Type, Authorization`

Refresh cookie recommendations:

- `HttpOnly: true`
- `Path: /`
- `SameSite`:
    - `Lax` for same-site setups
    - `None` for cross-site setups (requires `Secure=true`)
- `Secure: true` in production HTTPS

If cookie/CORS is misconfigured, refresh flow will fail and users will be logged out after token expiry.

---

## Error Contract

The frontend normalizes all errors, but backend consistency improves UX and observability.

Recommended status usage:

- `400` malformed payload
- `401` unauthenticated / token invalid / refresh missing
- `403` authenticated but forbidden
- `404` resource not found
- `409` conflict
- `422` validation failure
- `429` rate limited
- `5xx` server errors

Recommended error body shape:

```json
{
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
        "fields": [{ "field": "email", "message": "Invalid email" }]
    },
    "traceId": "req_123"
}
```

The frontend can operate with just `message`, but `code`, `details`, and `traceId` are highly recommended.

---

## Role Requirements

Viteplate expects these roles for route guards:

- `admin` -> home route `/admin`
- `user` -> home route `/dashboard`
- `viewer` -> home route `/overview`

If your backend uses different role values, adapt mapping in `src/shared/config/constants.ts`.

---

## Local Development Tips

1. Set frontend env:

```env
VITE_API_BASE_URL=http://localhost:3000
```

2. Verify login response includes `accessToken`, `refreshToken`, and `user`
3. Verify `/users/me` returns `401` without token and `200` with valid token
4. Verify `/auth/refresh` works with only cookie present
5. Verify logout clears refresh cookie and invalidates server session

---

## Related Docs

- `docs/api-layer.md`
- `docs/auth.md`
- `docs/routing.md`
