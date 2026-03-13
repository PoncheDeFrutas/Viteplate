# Creating a Widget

This guide walks through creating a new widget in Viteplate, using the existing `navbar` widget as a reference. Widgets are self-contained composed blocks that combine features, entities, and shared UI.

---

## Table of Contents

- [What is a Widget?](#what-is-a-widget)
- [Widget Structure](#widget-structure)
- [Step-by-Step Guide](#step-by-step-guide)
- [Real Example: navbar](#real-example-navbar)
- [Real Example: footer](#real-example-footer)
- [Checklist](#checklist)

---

## What is a Widget?

A widget is a **self-contained UI block** that combines components and logic from lower layers into a reusable composition. Widgets are more complex than shared UI primitives but more reusable than pages.

**Examples:** Navigation bar, footer, sidebar, user profile card, notification panel, comment thread.

**FSD Rules for Widgets:**

- May import from features, entities, and shared
- May NOT import from other widgets, pages, or app
- May contain local state and hooks
- Must not contain business logic that belongs in a feature
- Must expose a public API through `index.ts`

---

## Widget Structure

```
src/widgets/
└── [widget-name]/
    ├── index.ts              # Public API barrel
    ├── [WidgetName].tsx      # Main component
    ├── [helper-name].ts      # Configuration, utilities (kebab-case)
    └── use-[name].ts         # Custom hooks (if needed)
```

Widgets are typically simpler than features. They compose existing pieces rather than implementing new business logic.

---

## Step-by-Step Guide

### Step 1: Plan the Widget

| Question                         | Example (sidebar)                            |
| -------------------------------- | -------------------------------------------- |
| What does it display?            | Navigation links, user info, collapse toggle |
| Where will it be used?           | Protected layout                             |
| What data does it need?          | Current user, navigation items, route state  |
| Does it need local state?        | Yes -- collapsed/expanded state              |
| What layers does it import from? | entities (session), shared (ui, config)      |

### Step 2: Create the Directory

```bash
mkdir -p src/widgets/[widget-name]
```

### Step 3: Create Configuration (if needed)

If the widget has static configuration data, define it in a separate file:

```typescript
// src/widgets/sidebar/sidebar-config.ts
import { ROUTE_PATHS } from '@shared/config';
import type { LucideIcon } from 'lucide-react';
import { Home, Settings, Users, BarChart } from 'lucide-react';

export interface SidebarItem {
    label: string;
    path: string;
    icon: LucideIcon;
    roles: string[];
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
    { label: 'Dashboard', path: ROUTE_PATHS.DASHBOARD, icon: Home, roles: ['user', 'admin'] },
    { label: 'Users', path: '/users', icon: Users, roles: ['admin'] },
    { label: 'Analytics', path: '/analytics', icon: BarChart, roles: ['admin'] },
    { label: 'Settings', path: '/settings', icon: Settings, roles: ['user', 'admin'] },
];
```

### Step 4: Create a Custom Hook (if needed)

If the widget needs to filter or transform data:

```typescript
// src/widgets/sidebar/use-sidebar-items.ts
import { useMemo } from 'react';
import { useSession } from '@entities/session';
import { SIDEBAR_ITEMS } from './sidebar-config';
import type { SidebarItem } from './sidebar-config';

export function useSidebarItems(): SidebarItem[] {
    const role = useSession((s) => s.user?.role);

    return useMemo(
        () => SIDEBAR_ITEMS.filter((item) => !role || item.roles.includes(role)),
        [role],
    );
}
```

### Step 5: Create the Component

```typescript
// src/widgets/sidebar/Sidebar.tsx
import { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import { Button } from '@shared/ui';
import { useSidebarItems } from './use-sidebar-items';

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const items = useSidebarItems();
    const currentPath = useRouterState({ select: (s) => s.location.pathname });

    return (
        <aside
            className={cn(
                'flex h-full flex-col border-r border-border bg-surface transition-all',
                collapsed ? 'w-16' : 'w-60',
            )}
        >
            <div className="flex items-center justify-end p-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <ChevronLeft
                        className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
                    />
                </Button>
            </div>

            <nav className="flex-1 space-y-1 px-2">
                {items.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm',
                            currentPath === item.path
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground hover:bg-accent/50',
                        )}
                    >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
```

### Step 6: Create the Public API

```typescript
// src/widgets/sidebar/index.ts
export { Sidebar } from './Sidebar';
```

### Step 7: Use in a Layout

```typescript
// src/app/layouts/ProtectedLayout.tsx
import { Sidebar } from '@widgets/sidebar';

export function ProtectedLayout() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
```

---

## Real Example: navbar

The navbar widget is the most complex widget in Viteplate. It renders differently for public and authenticated users.

```
src/widgets/navbar/
├── index.ts              # Exports: Navbar
├── Navbar.tsx            # Main component (PublicNavbar + AuthNavbar)
├── nav-config.ts         # Navigation item definitions
└── use-nav-items.ts      # Role-aware filtering hook
```

### How It Works

**`nav-config.ts`** defines all possible navigation items with role constraints:

```typescript
export interface NavItem {
    label: string;
    path: string;
    roles?: string[]; // Undefined = visible to all
}

export const PUBLIC_NAV_ITEMS: NavItem[] = [
    { label: 'Home', path: ROUTE_PATHS.HOME },
    { label: 'About', path: ROUTE_PATHS.ABOUT },
    { label: 'Stack', path: ROUTE_PATHS.STACK },
];

export const AUTH_NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', path: ROUTE_PATHS.DASHBOARD, roles: ['user'] },
    { label: 'Dashboard', path: ROUTE_PATHS.ADMIN, roles: ['admin'] },
    { label: 'Settings', path: ROUTE_PATHS.ADMIN_SETTINGS, roles: ['admin'] },
    { label: 'Overview', path: ROUTE_PATHS.VIEWER, roles: ['viewer'] },
];
```

**`use-nav-items.ts`** filters items by the current user's role:

```typescript
export function useNavItems(): NavItem[] {
    const role = useSession((s) => s.user?.role);
    return useMemo(
        () => AUTH_NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role ?? '')),
        [role],
    );
}
```

**`Navbar.tsx`** renders two variants:

- `PublicNavbar` -- Shown to unauthenticated users. Displays public links + theme toggle + login button.
- `AuthNavbar` -- Shown to authenticated users. Displays role-filtered links + theme toggle + logout button.

The parent component checks `isAuthenticated()` to decide which variant to render.

---

## Real Example: footer

The footer is the simplest possible widget:

```
src/widgets/footer/
├── index.ts              # Exports: Footer
└── Footer.tsx            # Static footer component
```

It imports only from `@shared/ui` and renders static content. No hooks, no configuration files.

---

## Checklist

| Step                                             | Done? |
| ------------------------------------------------ | ----- |
| Directory follows `widgets/[name]/` pattern      |       |
| Main component file is `PascalCase.tsx`          |       |
| Helper files are `kebab-case.ts`                 |       |
| Hook files follow `use-[name].ts` pattern        |       |
| Component is a named export (no default export)  |       |
| `index.ts` exports only the public API           |       |
| No imports from other widgets, pages, or app     |       |
| Business logic is in features, not in the widget |       |
| Uses `cn()` for class composition                |       |
| Uses design tokens (not raw colors)              |       |
| Accessible (ARIA labels, semantic HTML)          |       |
| No `any` types                                   |       |
