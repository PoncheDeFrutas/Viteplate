# Routing

Viteplate uses [TanStack Router](https://tanstack.com/router) with **code-based routing** (not file-based). Routes are defined programmatically in TypeScript, giving full type safety over route parameters, search params, and navigation.

---

## Table of Contents

- [Overview](#overview)
- [Route Tree](#route-tree)
- [Router Context](#router-context)
- [Route Guards](#route-guards)
- [Layouts](#layouts)
- [Navigation](#navigation)
- [Adding a New Route](#adding-a-new-route)

---

## Overview

The routing system lives in `src/app/` and is composed of:

| File                                  | Purpose                                                 |
| ------------------------------------- | ------------------------------------------------------- |
| `routers/route-tree.ts`               | Defines every route and their hierarchy                 |
| `routers/router-context.ts`           | TypeScript type for the router context                  |
| `providers/router/RouterProvider.tsx` | Creates and provides the router instance                |
| `guards/auth-guard.ts`                | Redirects unauthenticated users to `/login`             |
| `guards/guest-guard.ts`               | Redirects authenticated users to their role's home page |
| `guards/role-guard.ts`                | Restricts routes to specific roles                      |
| `layouts/PublicLayout.tsx`            | Layout for unauthenticated pages                        |
| `layouts/ProtectedLayout.tsx`         | Layout for authenticated pages                          |

---

## Route Tree

All routes are defined in `src/app/routers/route-tree.ts`. The tree uses two layout routes to partition public and protected areas:

```
Root (/)
├── Public Layout
│   ├── /              Home (guest guard: redirects auth users)
│   ├── /about         About page
│   ├── /stack         Tech stack page
│   └── /login         Login page (guest guard)
│
├── Protected Layout
│   ├── /dashboard     User dashboard (role: user)
│   ├── /admin         Admin dashboard (role: admin)
│   ├── /admin/settings  Admin settings (role: admin)
│   └── /overview      Viewer dashboard (role: viewer)
│
├── /unauthorized      Standalone (no layout guard)
└── * (catch-all)      Not Found page
```

### Route Definition Pattern

Routes are created using TanStack Router's `createRoute` API:

```typescript
const dashboardRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: ROUTE_PATHS.dashboard,
    beforeLoad: createRoleGuard('user'),
    component: DashboardPage,
});
```

Each route specifies:

- **Parent route** -- determines layout nesting
- **Path** -- the URL segment
- **beforeLoad** -- guard logic that runs before the route loads
- **component** -- the page component to render

---

## Router Context

The router context provides shared state to all routes and guards. It is typed in `src/app/routers/router-context.ts` and injected when the router is created.

The context provides access to:

- The session store (authentication state, user info, roles)
- The query client (for prefetching or cache invalidation in guards)

This allows guards to check authentication status and roles without importing stores directly.

---

## Route Guards

Guards are functions that run in `beforeLoad` before a route renders. They inspect the router context and either allow navigation or redirect.

### `authGuard`

**File:** `src/app/guards/auth-guard.ts`

Checks if the user is authenticated. If not, redirects to `/login`.

```typescript
beforeLoad: authGuard,
```

### `guestGuard`

**File:** `src/app/guards/guest-guard.ts`

Checks if the user is unauthenticated. If they are already logged in, redirects to their role's home page using `getRoleHomePath()`.

```typescript
beforeLoad: guestGuard,
```

### `createRoleGuard`

**File:** `src/app/guards/role-guard.ts`

Factory function that creates a guard requiring one or more specific roles. If the user lacks the required role, redirects to `/unauthorized`.

```typescript
beforeLoad: createRoleGuard('admin'),
```

### Guard Execution Flow

```
User navigates to /admin
  |
  v
Protected layout beforeLoad runs authGuard
  |
  ├── Not authenticated?  -->  Redirect to /login
  └── Authenticated?  -->  Continue to admin-layout route
                               |
                               v
                         admin-layout beforeLoad runs createRoleGuard('admin')
                               |
                               ├── Not admin?  -->  Redirect to /unauthorized
                               └── Is admin?   -->  Allow, render AdminDashboardPage
```

---

## Layouts

Layouts are route components that render an `<Outlet />` for their child routes. They provide shared chrome (navbar, footer, spacing).

### `PublicLayout`

**File:** `src/app/layouts/PublicLayout.tsx`

Wraps all public-facing pages with:

- `Navbar` (public variant with theme toggle and login link)
- Main content area with scroll-to-top on navigation
- `Footer`

### `ProtectedLayout`

**File:** `src/app/layouts/ProtectedLayout.tsx`

Wraps all authenticated pages with:

- `Navbar` (authenticated variant with role-based navigation and logout)
- Main content area with scroll-to-top on navigation
- `Footer`

The `authGuard` runs on the protected layout route itself, so all child routes are automatically protected.

---

## Navigation

### Programmatic Navigation

Use TanStack Router's `useNavigate` hook:

```typescript
import { useNavigate } from '@tanstack/react-router';

const navigate = useNavigate();
navigate({ to: '/dashboard' });
```

### Link Components

Use TanStack Router's `<Link>` component for declarative navigation:

```typescript
import { Link } from '@tanstack/react-router';

<Link to="/about" className="text-primary">About</Link>
```

### Role-Based Navigation

The `useNavItems` hook in `src/widgets/navbar/use-nav-items.ts` returns navigation items based on the current user's role. The `nav-config.ts` file defines which links are visible to each role.

| Role     | Visible Routes      |
| -------- | ------------------- |
| `admin`  | Dashboard, Settings |
| `user`   | Dashboard           |
| `viewer` | Overview            |

---

## Adding a New Route

1. **Create the page component** in `src/pages/your-page/YourPage.tsx`
2. **Export it** from the page's `index.ts`
3. **Define the route** in `src/app/routers/route-tree.ts`:

```typescript
import { YourPage } from '@pages/your-page';

const yourRoute = createRoute({
    getParentRoute: () => publicLayoutRoute, // or protectedLayoutRoute
    path: '/your-path',
    component: YourPage,
});
```

4. **Add it to the route tree** by including it in the parent's `children` array
5. **Add guards** if needed via the `beforeLoad` option
6. **Update navigation** in `src/widgets/navbar/nav-config.ts` if the page should appear in the navbar

For a complete walkthrough, see [Creating a Page](./guides/creating-a-page.md).
