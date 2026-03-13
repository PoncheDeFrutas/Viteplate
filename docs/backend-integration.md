# Backend Integration Guide

This guide defines what a backend must provide so Viteplate can work end-to-end,
including success and failure contracts aligned with client-side types and Axios
interceptor behavior.

Treat this as the source of truth between frontend and backend teams.

---

## Table of Contents

- [Backend Integration Guide](#backend-integration-guide)
    - [Table of Contents](#table-of-contents)
    - [Integration Checklist](#integration-checklist)
    - [Base Client Behavior](#base-client-behavior)
    - [Required Endpoints](#required-endpoints)
        - [`POST /auth/login`](#post-authlogin)
        - [`POST /auth/refresh`](#post-authrefresh)
        - [`POST /auth/logout`](#post-authlogout)
        - [`GET /users/me`](#get-usersme)
    - [Success Data Contracts](#success-data-contracts)
        - [Login request DTO](#login-request-dto)
        - [Login response DTO](#login-response-dto)
        - [Refresh response DTO](#refresh-response-dto)
        - [Logout response DTO](#logout-response-dto)
        - [User DTO (`GET /users/me`)](#user-dto-get-usersme)
    - [Failure Contracts by Endpoint](#failure-contracts-by-endpoint)
        - [`POST /auth/login` failures](#post-authlogin-failures)
        - [`POST /auth/refresh` failures](#post-authrefresh-failures)
        - [`POST /auth/logout` failures](#post-authlogout-failures)
        - [`GET /users/me` failures](#get-usersme-failures)
    - [Client Error Normalization Contract](#client-error-normalization-contract)
        - [Backend error body shape the normalizer reads](#backend-error-body-shape-the-normalizer-reads)
        - [Status-to-code mapping used on client](#status-to-code-mapping-used-on-client)
        - [Retry semantics](#retry-semantics)
        - [Schema mismatch failures (very important)](#schema-mismatch-failures-very-important)
    - [Auth and Refresh Lifecycle](#auth-and-refresh-lifecycle)
    - [CORS and Cookie Requirements](#cors-and-cookie-requirements)
    - [Role Requirements](#role-requirements)
    - [Local Verification Checklist](#local-verification-checklist)
    - [Related Docs](#related-docs)

---

## Integration Checklist

Backend is considered compatible when all of this is true:

1. Exposes `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`, `GET /users/me`
2. Accepts and returns JSON shapes documented below
3. Supports cookie-based refresh (`httpOnly` refresh cookie)
4. Accepts `Authorization: Bearer <accessToken>` for protected endpoints
5. Enables CORS with credentials for frontend origin
6. Returns stable status codes (`401`, `403`, `422`, `429`, `5xx`)
7. Returns role in user payload (`admin` | `user` | `viewer`)

---

## Base Client Behavior

Frontend HTTP behavior (from `src/shared/api/http/client.ts` + config):

- Base URL: `VITE_API_BASE_URL`
- Timeout: `10_000ms`
- Default headers:
    - `Content-Type: application/json`
    - `Accept: application/json`
- Requests use credentials (`withCredentials: true`)

Interceptors:

- Request interceptor attaches Bearer token unless `skipAuth: true`
- Response interceptor handles `401` with single-flight refresh and request replay

Related files:

- `src/shared/api/http/interceptors/request-auth.ts`
- `src/shared/api/http/interceptors/response-auth.ts`
- `src/shared/api/http/refresh-controller.ts`

---

## Required Endpoints

### `POST /auth/login`

- Purpose: authenticate with email/password
- Auth header: not required
- Request body:

```json
{
    "email": "admin@example.com",
    "password": "secret"
}
```

- Success (`200`):

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

Also set refresh cookie:

- `Set-Cookie: refreshToken=...; HttpOnly; Path=/; SameSite=Lax|None; Secure?`

### `POST /auth/refresh`

- Purpose: refresh session using cookie
- Auth header: not required (`skipAuth: true`)
- Body: none
- Success (`200`):

```json
{
    "accessToken": "new-access-token",
    "refreshToken": "new-refresh-token-or-placeholder"
}
```

### `POST /auth/logout`

- Purpose: invalidate refresh session
- Body: none
- Cookie included via credentials
- Success (`200`):

```json
{
    "success": true
}
```

### `GET /users/me`

- Purpose: fetch current authenticated user
- Auth header: required
- Success (`200`):

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

## Success Data Contracts

These contracts are validated with Zod on the client.

### Login request DTO

```ts
{
    email: string; // valid email
    password: string; // min length 1
}
```

### Login response DTO

```ts
{
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: 'admin' | 'user' | 'viewer';
        created_at: string; // ISO datetime
        updated_at: string; // ISO datetime
    }
}
```

### Refresh response DTO

```ts
{
    accessToken: string;
    refreshToken: string;
}
```

### Logout response DTO

```ts
{
    success: boolean;
}
```

### User DTO (`GET /users/me`)

```ts
{
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user' | 'viewer';
    created_at: string;
    updated_at: string;
}
```

Important: timestamps must be snake_case fields (`created_at`, `updated_at`).

---

## Failure Contracts by Endpoint

### `POST /auth/login` failures

- `400` or `422`: payload invalid
- `401`: invalid credentials
- `429`: rate limited
- `5xx`: server failures

Recommended payload:

```json
{
    "message": "Invalid email or password.",
    "code": "UNAUTHORIZED",
    "traceId": "req_abc123"
}
```

### `POST /auth/refresh` failures

- `401`: refresh cookie missing/expired/invalid
- `429`, `5xx`: transient backend failures

Frontend behavior:

- refresh is single-flight (one request shared by concurrent 401s)
- max attempts per unauthorized cycle: `2`
- after max failures, session is cleared and user is logged out

### `POST /auth/logout` failures

- frontend clears local session regardless of server response
- backend should still best-effort clear cookie/session

### `GET /users/me` failures

- `401`: missing/expired/invalid access token
- `403`: authenticated but forbidden
- `404`: user not found

When `/users/me` returns `401`, frontend first tries refresh; if refresh fails, it logs out.

---

## Client Error Normalization Contract

Client normalizes failures to `ApiError` from `src/shared/types/api-error.ts`.

```ts
type ApiErrorCode =
    | 'UNAUTHORIZED'
    | 'TIMEOUT'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'NETWORK_ERROR'
    | 'RATE_LIMITED'
    | 'REQUEST_CANCELED'
    | 'CONFLICT'
    | 'VALIDATION_ERROR'
    | 'SERVER_ERROR'
    | 'UNKNOWN_ERROR';

interface FieldError {
    field: string;
    message: string;
}

interface ApiErrorDetails {
    reason?: string;
    fields?: FieldError[];
    meta?: Record<string, unknown>;
}

interface ApiError {
    code: ApiErrorCode;
    message: string;
    status?: number;
    traceId?: string;
    timestamp: string;
    path?: string;
    method?: string;
    isRetryable: boolean;
    details?: ApiErrorDetails;
}
```

### Backend error body shape the normalizer reads

The normalizer expects these fields at the root of response body:

```json
{
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "traceId": "req_123",
    "reason": "schema_validation",
    "fields": [{ "field": "email", "message": "Invalid email" }],
    "meta": { "requestId": "abc" }
}
```

Important: root-level `fields`/`reason`/`meta` are parsed. Nested `details.fields`
is not currently read by the normalizer.

### Status-to-code mapping used on client

| Status                 | Client `ApiError.code` |
| ---------------------- | ---------------------- |
| `400`, `422`           | `VALIDATION_ERROR`     |
| `401`                  | `UNAUTHORIZED`         |
| `403`                  | `FORBIDDEN`            |
| `404`                  | `NOT_FOUND`            |
| `408`, `504`           | `TIMEOUT`              |
| `409`                  | `CONFLICT`             |
| `429`                  | `RATE_LIMITED`         |
| `500`, `502`, `503`    | `SERVER_ERROR`         |
| other/unknown statuses | `UNKNOWN_ERROR`        |

If backend sends a recognized `code`, that value takes precedence over status mapping.

### Retry semantics

`isRetryable` is `true` only for:

- `NETWORK_ERROR`
- `TIMEOUT`
- `RATE_LIMITED`
- `SERVER_ERROR`

All other codes are non-retryable.

### Schema mismatch failures (very important)

Even with HTTP `200`, frontend fails request if JSON shape does not match Zod schema.
In this case client creates:

- `code: VALIDATION_ERROR`
- `message: Response validation failed. The server returned an unexpected shape.`
- `details.reason: schema_validation`
- `details.fields: [...]` derived from Zod issues

This is how backend contract drift is detected early.

---

## Auth and Refresh Lifecycle

1. Login (`POST /auth/login`) returns tokens + user
2. Frontend stores access token in memory (not localStorage)
3. Protected requests include `Authorization: Bearer <accessToken>`
4. On `401`, response interceptor starts refresh flow (`POST /auth/refresh`)
5. Concurrent 401s are queued behind one refresh request (single-flight)
6. On refresh success, original requests replay automatically
7. On refresh failure after max attempts, session is cleared and user is redirected to `/login`

Session cleanup reasons used by client adapter:

- `logout`
- `missing_refresh_token`
- `refresh_failed`
- `manual_reset`

---

## CORS and Cookie Requirements

For frontend `http://localhost:5173` and backend `http://localhost:3000`:

- `Access-Control-Allow-Origin: http://localhost:5173`
- `Access-Control-Allow-Credentials: true`
- Allowed methods: `GET, POST, PATCH, PUT, DELETE, OPTIONS`
- Allowed headers: `Content-Type, Authorization`

Refresh cookie recommendations:

- `HttpOnly: true`
- `Path: /`
- `SameSite: Lax` (same-site) or `None` (cross-site + `Secure=true`)
- `Secure: true` in production HTTPS

If cookie or CORS is wrong, refresh flow fails and users get logged out when access token expires.

---

## Role Requirements

Client expects these role values:

- `admin` -> `/admin`
- `user` -> `/dashboard`
- `viewer` -> `/overview`

If backend roles differ, map them in `src/shared/config/constants.ts` (`getRoleHomePath`).

---

## Local Verification Checklist

1. Set frontend env:

```env
VITE_API_BASE_URL=http://localhost:3000
```

1. Confirm login response matches schema exactly
2. Confirm `/users/me` returns:
    - `200` with valid bearer token
    - `401` with missing/invalid token
3. Confirm `/auth/refresh` works with only refresh cookie
4. Confirm refresh failure (`401`) logs user out after retry budget
5. Confirm backend error payload uses root-level `message/code/traceId/reason/fields/meta`
6. Confirm intentional malformed response causes client `VALIDATION_ERROR` (schema validation)

---

## Related Docs

- `docs/api-layer.md`
- `docs/auth.md`
- `docs/routing.md`
