# State Management

Viteplate uses two complementary state management approaches: **Zustand** for client-side state and **TanStack Query** for server-side state. Each serves a distinct purpose and they work together through well-defined boundaries.

---

## Table of Contents

- [Philosophy](#philosophy)
- [Client State: Zustand](#client-state-zustand)
- [Server State: TanStack Query](#server-state-tanstack-query)
- [How They Work Together](#how-they-work-together)
- [When to Use Which](#when-to-use-which)

---

## Philosophy

| Concern            | Tool           | Examples                              |
| ------------------ | -------------- | ------------------------------------- |
| Client-owned state | Zustand        | Session tokens, UI preferences, theme |
| Server-owned state | TanStack Query | User profiles, API data, lists        |

Client state is data that the frontend creates and owns. Server state is data that originates from an API and needs to be synchronized (fetched, cached, invalidated). Mixing these concerns in a single store leads to stale data and complex synchronization bugs.

---

## Client State: Zustand

### Session Store

**Files:**

- `src/entities/session/model/store.ts` -- Store definition
- `src/entities/session/model/use-session.ts` -- React hook

The session store is the primary Zustand store in Viteplate. It is a **vanilla store** (created with `createStore`, not `create`) to allow access from both React components and non-React code (interceptors, guards).

#### Store Shape

The store separates state from actions:

```typescript
interface SessionState {
    accessToken: string | null;
    user: User | null;
}

interface SessionActions {
    setAccessToken: (token: string) => void;
    setUser: (user: User) => void;
    clearSession: (reason: SessionCleanupReason) => void;
    hasRole: (role: Role) => boolean;
    isAuthenticated: () => boolean;
}

type SessionStore = SessionState & SessionActions;
```

`SessionCleanupReason` is a union: `'logout' | 'missing_refresh_token' | 'refresh_failed' | 'manual_reset'`. `Role` is `'admin' | 'user' | 'viewer'`.

#### Reading State in React

Use the `useSession` hook with a selector for optimal re-renders:

```typescript
import { useSession } from '@entities/session';

// Only re-renders when user changes
const user = useSession((s) => s.user);

// Only re-renders when auth state changes
const isAuth = useSession((s) => s.isAuthenticated());

// Multiple values (re-renders when either changes)
const { user, accessToken } = useSession((s) => ({
    user: s.user,
    accessToken: s.accessToken,
}));
```

#### Reading State Outside React

Access the store directly for non-React code (interceptors, adapters):

```typescript
import { sessionStore } from '@entities/session';

// Get current state snapshot
const token = sessionStore.getState().accessToken;

// Subscribe to changes
const unsubscribe = sessionStore.subscribe((state) => {
    console.log('Session changed:', state.user?.name);
});
```

#### Why Vanilla Store?

The session store uses `createStore` (vanilla) rather than `create` (React-bound) because:

1. **Interceptors need access** -- HTTP interceptors run outside React's component tree
2. **Guards need access** -- Route guards execute before components render
3. **Session adapter needs access** -- The token bridge in `shared/api/` cannot import React hooks

The `useSession` hook wraps the vanilla store with `useStore` for React components.

### Design Decisions

| Decision                        | Rationale                                                      |
| ------------------------------- | -------------------------------------------------------------- |
| In-memory only (no persistence) | Access tokens should not survive browser sessions for security |
| Vanilla store                   | Needed by non-React code (interceptors, guards)                |
| Selector-based reads            | Prevents unnecessary re-renders                                |
| `clearSession(reason)`          | Reason parameter aids debugging (logged in DEV mode)           |

---

## Server State: TanStack Query

### Configuration

**Files:**

- `src/app/providers/query/query-config.ts` -- Default options
- `src/app/providers/query/QueryProvider.tsx` -- Provider component

#### Default Settings

| Setting                | Value      | Purpose                                                    |
| ---------------------- | ---------- | ---------------------------------------------------------- |
| `staleTime`            | 60 seconds | Data is fresh for 1 minute before background refetch       |
| `gcTime`               | 5 minutes  | Unused cache entries are garbage collected after 5 minutes |
| `retry` (queries)      | 1          | One retry attempt on query failure                         |
| `retry` (mutations)    | `false`    | No retries for mutations (they are not idempotent)         |
| `refetchOnWindowFocus` | `false`    | No automatic refetch when the window regains focus         |

### Query Patterns

#### Defining Query Options

Entity queries are defined in the entity's `api/` segment using `queryOptions`:

```typescript
// src/entities/user/api/queries.ts
import { queryOptions } from '@tanstack/react-query';
import { fetchCurrentUser } from './endpoints';

export const currentUserQueryOptions = queryOptions({
    queryKey: ['user', 'me'],
    queryFn: fetchCurrentUser,
});
```

#### Using Queries in Components

```typescript
import { useQuery } from '@tanstack/react-query';
import { currentUserQueryOptions } from '@entities/user';

function UserProfile() {
    const { data: user, isLoading, error } = useQuery(currentUserQueryOptions);

    if (isLoading) return <Spinner />;
    if (error) return <ErrorMessage message={error.message} />;
    return <div>{user.name}</div>;
}
```

### Mutation Patterns

Feature mutations are defined in the feature's `model/` segment:

```typescript
// src/features/auth/login/model/use-login.ts
import { useMutation } from '@tanstack/react-query';
import { login } from '../api/endpoint';
import { sessionStore } from '@entities/session';

export function useLogin() {
    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            sessionStore.getState().setAccessToken(data.accessToken);
            sessionStore.getState().setUser(data.user);
        },
    });
}
```

### DevTools

TanStack Query DevTools are automatically included in development mode. They appear as a floating panel in the browser and show:

- Active queries and their cache state
- Background refetches in progress
- Cache timing (stale, fresh, garbage collection)

---

## How They Work Together

The two systems interact at well-defined points:

```
Login mutation (TanStack Query)
  |
  v
On success: sessionStore.setAccessToken() + sessionStore.setUser() (Zustand)
  |
  v
Session state triggers UI updates (Navbar shows user, guards allow routes)
  |
  v
Subsequent API calls use token from sessionStore (via session adapter)
  |
  v
API responses cached in TanStack Query
```

### Interaction Points

| Event         | Zustand Role                       | TanStack Query Role                         |
| ------------- | ---------------------------------- | ------------------------------------------- |
| Login         | Stores access token and user       | Executes the mutation                       |
| API request   | Provides token via session adapter | Manages cache and refetch logic             |
| Token refresh | Stores new token                   | Not involved (refresh is in interceptors)   |
| Logout        | Clears session                     | Query cache can be cleared if needed        |
| Data fetch    | Not involved                       | Caches, deduplicates, and manages staleness |

---

## When to Use Which

| Scenario                  | Tool                           | Example                              |
| ------------------------- | ------------------------------ | ------------------------------------ |
| Auth tokens               | Zustand                        | `sessionStore.setAccessToken(token)` |
| Current user identity     | Zustand                        | `useSession((s) => s.user)`          |
| Theme preference          | Zustand / React Context        | `useTheme()`                         |
| API response data         | TanStack Query                 | `useQuery(userQueryOptions)`         |
| Form submission           | TanStack Query + TanStack Form | `useMutation({ mutationFn })`        |
| List data with pagination | TanStack Query                 | `useInfiniteQuery(...)`              |
| Optimistic updates        | TanStack Query                 | `onMutate` / `onSettled` callbacks   |

### Rules of Thumb

1. If the data comes from an API, use TanStack Query.
2. If the data is client-only and needs to be accessed outside React, use a Zustand vanilla store.
3. If the data is client-only and scoped to a React subtree, consider React context (like the theme context).
4. Do not duplicate server state in Zustand. Let TanStack Query be the single source of truth for API data.
