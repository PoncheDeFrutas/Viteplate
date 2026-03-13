# Creating a Page

This guide walks through creating a new page (route-level component) in Viteplate. Pages are thin compositions that assemble widgets, features, and shared UI into a complete view.

---

## Table of Contents

- [What is a Page?](#what-is-a-page)
- [Page Structure](#page-structure)
- [Step-by-Step Guide](#step-by-step-guide)
- [Route Registration](#route-registration)
- [Adding Guards](#adding-guards)
- [Adding Navigation](#adding-navigation)
- [Real Examples](#real-examples)
- [Checklist](#checklist)

---

## What is a Page?

A page is a **route-level composition**. It renders the content for a specific URL path by assembling components from lower layers (widgets, features, entities, shared).

**FSD Rules for Pages:**

- May import from widgets, features, entities, and shared
- May NOT import from other pages or app
- Should be thin -- no direct HTTP calls, no complex logic
- One page component per route

---

## Page Structure

```
src/pages/
└── [page-name]/
    ├── index.ts              # Public API barrel
    └── [PageName]Page.tsx    # Page component
```

Pages are intentionally simple. If a page needs complex logic, that logic belongs in a feature or widget.

---

## Step-by-Step Guide

### Step 1: Create the Directory

```bash
mkdir -p src/pages/[page-name]
```

### Step 2: Create the Page Component

```typescript
// src/pages/settings/SettingsPage.tsx
import { motion } from 'motion/react';
import { Settings } from 'lucide-react';
import { Container } from '@shared/ui';
import { FADE_UP } from '@shared/lib/animation-presets';

export function SettingsPage() {
    return (
        <Container maxWidth="2xl" className="space-y-6">
            <motion.div {...FADE_UP} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Settings className="h-5 w-5 text-foreground" />
                </div>
                <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
            </motion.div>

            <motion.div {...FADE_UP} transition={{ ...FADE_UP.transition, delay: 0.1 }}>
                {/* Page content here */}
            </motion.div>
        </Container>
    );
}
```

### Key Patterns

| Pattern              | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `Container` wrapping | Provides consistent width constraints and padding          |
| `motion` animations  | Fade-up on mount using shared animation presets            |
| `h1` heading         | Every page should have a primary heading for accessibility |
| Lucide icons         | Visual identifier in the header area                       |
| Semantic tokens      | Use `text-foreground`, `bg-muted`, etc. (not raw colors)   |

### Step 3: Create the Public API

```typescript
// src/pages/settings/index.ts
export { SettingsPage } from './SettingsPage';
```

### Step 4: Register the Route

Open `src/app/routers/route-tree.ts` and add the route:

```typescript
import { SettingsPage } from '@pages/settings';

const settingsRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: '/settings',
    beforeLoad: createRoleGuard('user', 'admin'),
    component: SettingsPage,
});
```

Then add it to the parent route's children array:

```typescript
const protectedRoutes = protectedLayoutRoute.addChildren([
    dashboardRoute,
    adminRoute,
    adminSettingsRoute,
    viewerRoute,
    settingsRoute, // Add here
]);
```

### Step 5: Add Navigation (Optional)

If the page should appear in the navbar, update `src/widgets/navbar/nav-config.ts`:

```typescript
{ label: 'Settings', to: ROUTE_PATHS.settings },
```

And add the route path to `src/shared/config/constants.ts`:

```typescript
export const ROUTE_PATHS = {
    // ... existing paths
    settings: '/settings',
} as const;
```

---

## Route Registration

### Parent Route Selection

| Layout                 | Use When                                  | Guard                                        |
| ---------------------- | ----------------------------------------- | -------------------------------------------- |
| `publicLayoutRoute`    | Page is accessible without authentication | Optional (`guestGuard` for login-only pages) |
| `protectedLayoutRoute` | Page requires authentication              | `authGuard` is inherited from parent         |
| None (root)            | Standalone pages (e.g., unauthorized)     | Custom                                       |

### Route Definition Options

```typescript
const myRoute = createRoute({
    getParentRoute: () => parentRoute,   // Required: determines layout
    path: '/my-path',                     // Required: URL path
    beforeLoad: ({ context }) => ...,     // Optional: guard logic
    component: MyPage,                    // Required: page component
});
```

---

## Adding Guards

### Public Page (No Guard)

```typescript
const aboutRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: '/about',
    component: AboutPage,
});
```

### Authentication Required

The `protectedLayoutRoute` already has `authGuard`, so child routes inherit it:

```typescript
const dashboardRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: '/dashboard',
    component: DashboardPage,
});
```

### Role Restriction

Add `createRoleGuard` in `beforeLoad`:

```typescript
const adminRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: ROUTE_PATHS.admin,
    beforeLoad: createRoleGuard('admin'),
    component: AdminDashboardPage,
});
```

### Guest Only (Redirect if Authenticated)

```typescript
const loginRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: ROUTE_PATHS.login,
    beforeLoad: guestGuard,
    component: LoginPage,
});
```

---

## Adding Navigation

To add a page to the navbar:

1. **Add route path** to `ROUTE_PATHS` in `src/shared/config/constants.ts`
2. **Add nav item** in `src/widgets/navbar/nav-config.ts` with the appropriate roles
3. The `useNavItems` hook will automatically include it for users with matching roles

---

## Real Examples

### Public Page: HomePage

```typescript
// src/pages/home/HomePage.tsx
export function HomePage() {
    return (
        <Container maxWidth="2xl" className="space-y-16 py-12">
            <motion.div {...FADE_UP} className="space-y-4 text-center">
                <h1 className="text-4xl font-bold text-foreground">Viteplate</h1>
                <p className="text-lg text-muted-foreground">
                    A scalable React starter built on Feature-Sliced Design.
                </p>
            </motion.div>
            {/* More sections */}
        </Container>
    );
}
```

### Protected Page: DashboardPage

```typescript
// src/pages/dashboard/DashboardPage.tsx
export function DashboardPage() {
    const user = useSession((s) => s.user);

    return (
        <Container maxWidth="2xl" className="space-y-6">
            <motion.h1 {...FADE_UP} className="text-2xl font-semibold text-foreground">
                Dashboard
            </motion.h1>
            {user ? (
                <Card>
                    <Avatar name={user.name} />
                    {/* User profile info */}
                </Card>
            ) : (
                <p className="text-sm text-muted-foreground">No user information available.</p>
            )}
        </Container>
    );
}
```

### Form Page: LoginPage

```typescript
// src/pages/login/LoginPage.tsx
export function LoginPage() {
    return (
        <div className="flex min-h-full items-center justify-center">
            <motion.div {...FADE_UP} className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold">Sign in</h1>
                </div>
                <Card variant="filled" padding="md">
                    <LoginForm />   {/* Feature component */}
                </Card>
            </motion.div>
        </div>
    );
}
```

---

## Checklist

| Step                                                   | Done? |
| ------------------------------------------------------ | ----- |
| Directory follows `pages/[name]/` pattern              |       |
| Component file is `PascalCase.tsx`                     |       |
| Component is a named export (no default export)        |       |
| Page has an `<h1>` heading for accessibility           |       |
| `index.ts` barrel exports the page component           |       |
| Route registered in `src/app/routers/route-tree.ts`    |       |
| Route added to parent's children array                 |       |
| Appropriate guard applied (auth, guest, role)          |       |
| Navigation updated in `nav-config.ts` (if needed)      |       |
| Route path added to `ROUTE_PATHS` constant (if needed) |       |
| No direct HTTP calls in the page                       |       |
| No complex business logic in the page                  |       |
