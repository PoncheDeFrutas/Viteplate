# API Layer

Viteplate provides a structured API layer built on Axios with typed HTTP methods, automatic authentication, token refresh, and normalized error handling. All API infrastructure lives in `src/shared/api/`.

---

## Table of Contents

- [Overview](#overview)
- [HTTP Client](#http-client)
- [Typed HTTP Methods](#typed-http-methods)
- [Configuration](#configuration)
- [Interceptors](#interceptors)
- [Error Normalization](#error-normalization)
- [Zod Validation](#zod-validation)
- [Skipping Authentication](#skipping-authentication)
- [Usage Patterns](#usage-patterns)

---

## Overview

The API layer is organized as follows:

```
src/shared/api/
├── index.ts                          # Public barrel
└── http/
    ├── client.ts                     # Axios instance and httpClient facade
    ├── http-methods.ts               # Typed get/post/put/patch/delete
    ├── http-config.ts                # Axios config defaults
    ├── session-adapter.ts            # Token access bridge
    ├── refresh-controller.ts         # Single-flight token refresh
    ├── interceptors/
    │   ├── request-auth.ts           # Attaches Bearer token
    │   └── response-auth.ts          # Handles 401 + refresh
    └── error/
        └── normalize-api-error.ts    # Error normalization
```

---

## HTTP Client

The HTTP client is a facade that wraps an Axios instance and exposes typed methods for each HTTP verb. It is created in `src/shared/api/http/client.ts`.

```typescript
import { httpClient } from '@shared/api';

// All methods return typed responses
const users = await httpClient.get<User[]>('/users');
const created = await httpClient.post<User>('/users', { name: 'Alice' });
```

The client automatically:

- Attaches the `Authorization: Bearer <token>` header to requests
- Retries requests that fail with 401 after refreshing the access token
- Normalizes all errors to the `ApiError` interface

---

## Typed HTTP Methods

Each HTTP method is defined in `src/shared/api/http/http-methods.ts` and provides full generic type safety:

| Method     | Signature                             | Purpose                   |
| ---------- | ------------------------------------- | ------------------------- |
| `get<T>`   | `(url, config?) => Promise<T>`        | Fetch resources           |
| `post<T>`  | `(url, data?, config?) => Promise<T>` | Create resources          |
| `put<T>`   | `(url, data?, config?) => Promise<T>` | Full resource replacement |
| `patch<T>` | `(url, data?, config?) => Promise<T>` | Partial resource update   |
| `del<T>`   | `(url, config?) => Promise<T>`        | Delete resources          |

The generic type parameter `T` types the response data, not the raw Axios response.

---

## Configuration

HTTP defaults are defined in `src/shared/api/http/http-config.ts`:

| Setting                | Value                        | Description                                      |
| ---------------------- | ---------------------------- | ------------------------------------------------ |
| `baseURL`              | From `VITE_API_BASE_URL` env | Base URL for all requests                        |
| `timeout`              | 10,000 ms                    | Request timeout                                  |
| `headers.Content-Type` | `application/json`           | Default content type                             |
| `headers.Accept`       | `application/json`           | Default accept header                            |
| `withCredentials`      | `true`                       | Send cookies (needed for httpOnly refresh token) |

These defaults can be overridden per-request via the config parameter.

---

## Interceptors

### Request Interceptor (`request-auth.ts`)

Runs before every outgoing request:

1. Checks if the request has `skipAuth: true` in its config
2. If not skipped, retrieves the access token from the session adapter
3. Attaches `Authorization: Bearer <token>` to the request headers

```
Outgoing Request
  |
  ├── skipAuth: true?  -->  Send without token
  └── skipAuth: false? -->  Attach Bearer token --> Send
```

### Response Interceptor (`response-auth.ts`)

Runs when a response returns an error:

1. Checks if the error is a 401 (Unauthorized)
2. If 401, attempts a single-flight token refresh via the refresh controller
3. If refresh succeeds, replays the original request with the new token
4. If refresh fails, forces logout and clears the session

```
401 Response
  |
  v
Refresh Controller
  |
  ├── Refresh succeeds  -->  Replay original request
  └── Refresh fails     -->  Clear session, redirect to /login
```

---

## Error Normalization

All API errors are normalized to a consistent `ApiError` interface via the `normalizeApiError()` function in `src/shared/api/http/error/normalize-api-error.ts`.

### `ApiError` Interface

```typescript
interface ApiError {
    code: ApiErrorCode;
    message: string;
    status: number | null;
    isRetryable: boolean;
    traceId: string | null;
    timestamp: string;
    details: Record<string, unknown> | null;
}
```

### Error Codes

| Code               | HTTP Status | Retryable | Description                              |
| ------------------ | ----------- | --------- | ---------------------------------------- |
| `UNAUTHORIZED`     | 401         | No        | Authentication required or token expired |
| `FORBIDDEN`        | 403         | No        | Insufficient permissions                 |
| `NOT_FOUND`        | 404         | No        | Resource does not exist                  |
| `CONFLICT`         | 409         | No        | Resource conflict (duplicate)            |
| `VALIDATION_ERROR` | 422         | No        | Request validation failed                |
| `RATE_LIMITED`     | 429         | Yes       | Too many requests                        |
| `SERVER_ERROR`     | 500-599     | Yes       | Server-side failure                      |
| `TIMEOUT`          | --          | Yes       | Request timed out                        |
| `NETWORK_ERROR`    | --          | Yes       | No network connection                    |
| `REQUEST_CANCELED` | --          | No        | Request was canceled                     |
| `UNKNOWN_ERROR`    | --          | No        | Unrecognized error                       |

### Usage

```typescript
import { normalizeApiError } from '@shared/api';

try {
    const data = await httpClient.get<User>('/me');
} catch (error) {
    const apiError = normalizeApiError(error);
    if (apiError.isRetryable) {
        // Implement retry logic
    }
    console.error(`[${apiError.code}] ${apiError.message}`);
}
```

---

## Zod Validation

API responses should be validated at runtime using `parseWithSchema()` from `@shared/lib`:

```typescript
import { parseWithSchema } from '@shared/lib/parse-with-schema';
import { userSchema } from '@entities/user';

const rawData = await httpClient.get('/me');
const user = parseWithSchema(userSchema, rawData);
// user is now fully typed and validated
```

`parseWithSchema()` throws a `ZodError` if validation fails, ensuring that unexpected API response shapes are caught immediately rather than causing runtime errors downstream.

---

## Skipping Authentication

Some endpoints (login, public data) should not include an auth token. Pass `skipAuth: true` in the request config:

```typescript
const response = await httpClient.post<LoginResponse>('/auth/login', credentials, {
    skipAuth: true,
});
```

This tells the request interceptor to skip attaching the Bearer token.

---

## Usage Patterns

### In a Feature Endpoint

```typescript
// src/features/auth/login/api/endpoint.ts
import { httpClient } from '@shared/api';
import type { LoginDto, LoginResponse } from './dto';

export async function loginEndpoint(dto: LoginDto): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>('/auth/login', dto, { skipAuth: true });
}
```

### In an Entity Query

```typescript
// src/entities/user/api/queries.ts
import { queryOptions } from '@tanstack/react-query';
import { fetchCurrentUser } from './endpoints';

export const currentUserQueryOptions = queryOptions({
    queryKey: ['user', 'me'],
    queryFn: fetchCurrentUser,
});
```

### With TanStack Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { currentUserQueryOptions } from '@entities/user';

function UserProfile() {
    const { data: user, isLoading, error } = useQuery(currentUserQueryOptions);
    // ...
}
```

For auth-specific API patterns, see [Auth System](./auth.md).
