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
    ├── client.ts                     # Axios instance (raw httpClient)
    ├── http-methods.ts               # Typed apiGet/apiPost/apiPut/apiPatch/apiDelete
    ├── http-config.ts                # Request config interfaces
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

The HTTP client is a raw Axios instance created in `src/shared/api/http/client.ts`. It is configured with base URL, timeout, default headers, and auth interceptors. You should not use `httpClient` directly in feature or entity code -- use the typed HTTP methods instead (see below).

The client automatically:

- Attaches the `Authorization: Bearer <token>` header to requests
- Retries requests that fail with 401 after refreshing the access token
- Normalizes all errors to the `ApiError` interface

---

## Typed HTTP Methods

Each HTTP method is defined in `src/shared/api/http/http-methods.ts`. These are the functions you should use in feature endpoints and entity API layers. Every method validates the response against a Zod schema before returning.

| Method         | Signature                                                    | Purpose                   |
| -------------- | ------------------------------------------------------------ | ------------------------- |
| `apiGet<T>`    | `(url, options: { schema, params?, config? }) => Promise<T>` | Fetch resources           |
| `apiPost<T>`   | `(url, body, options: { schema, config? }) => Promise<T>`    | Create resources          |
| `apiPut<T>`    | `(url, body, options: { schema, config? }) => Promise<T>`    | Full resource replacement |
| `apiPatch<T>`  | `(url, body, options: { schema, config? }) => Promise<T>`    | Partial resource update   |
| `apiDelete<T>` | `(url, options: { schema, config? }) => Promise<T>`          | Delete resources          |

The generic type parameter `T` is inferred from the Zod schema. Each method internally uses `httpClient`, calls `parseWithSchema()` on the response, and normalizes errors via `normalizeApiError()`.

---

## Configuration

HTTP configuration interfaces are defined in `src/shared/api/http/http-config.ts`. The Axios instance defaults are set in `src/shared/api/http/client.ts`:

| Setting                | Value                        | Description                                      |
| ---------------------- | ---------------------------- | ------------------------------------------------ |
| `baseURL`              | From `VITE_API_BASE_URL` env | Base URL for all requests                        |
| `timeout`              | 10,000 ms                    | Request timeout                                  |
| `headers.Content-Type` | `application/json`           | Default content type                             |
| `headers.Accept`       | `application/json`           | Default accept header                            |
| `withCredentials`      | `true`                       | Send cookies (needed for httpOnly refresh token) |

The `HttpRequestConfig` interface extends Axios config with additional fields like `skipAuth` (boolean) to control interceptor behavior. These defaults can be overridden per-request via the config parameter.

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
    status?: number;
    isRetryable: boolean;
    traceId?: string;
    timestamp: string;
    path?: string;
    method?: string;
    details?: ApiErrorDetails;
}

interface ApiErrorDetails {
    reason?: string;
    fields?: FieldError[];
    meta?: Record<string, unknown>;
}

interface FieldError {
    field: string;
    message: string;
    code?: string;
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
import { apiGet } from '@shared/api';
import { userSchema } from '@entities/user';

try {
    const user = await apiGet<User>('/me', { schema: userSchema });
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

API response validation is built into the typed HTTP methods. When you call `apiGet`, `apiPost`, etc., you pass a Zod schema and the response is validated automatically via `parseWithSchema()`:

```typescript
import { apiGet } from '@shared/api';
import { userSchema } from '@entities/user';

// Response is validated against userSchema before being returned
const user = await apiGet<User>('/me', { schema: userSchema });
```

`parseWithSchema()` throws a `ZodError` if validation fails, ensuring that unexpected API response shapes are caught immediately rather than causing runtime errors downstream.

For standalone usage outside the typed HTTP methods, `parseWithSchema()` is available from `@shared/lib`:

---

## Skipping Authentication

Some endpoints (login, public data) should not include an auth token. Pass `skipAuth: true` in the request config:

```typescript
const response = await apiPost<LoginResponse>('/auth/login', credentials, {
    schema: loginResponseSchema,
    config: { skipAuth: true },
});
```

This tells the request interceptor to skip attaching the Bearer token.

---

## Usage Patterns

### In a Feature Endpoint

```typescript
// src/features/auth/login/api/endpoint.ts
import { apiPost } from '@shared/api';
import { loginResponseDtoSchema } from './dto';
import type { LoginRequestDto, LoginResponseDto } from './dto';

export async function login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
    return apiPost(AUTH_ENDPOINTS.login, credentials, {
        schema: loginResponseDtoSchema,
        config: { skipAuth: true, withCredentials: true },
    });
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
