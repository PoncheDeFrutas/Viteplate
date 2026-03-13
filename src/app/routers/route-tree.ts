import { createRootRouteWithContext, createRoute, redirect } from '@tanstack/react-router';
import { ROUTE_PATHS } from '@shared/config';
import { authGuard, guestGuard } from '../guards';
import { PublicLayout } from '../layouts/PublicLayout';
import { ProtectedLayout } from '../layouts/ProtectedLayout';
import { LoginPage } from '@pages/login';
import { DashboardPage } from '@pages/dashboard';
import { NotFoundPage } from '@pages/not-found';
import { UnauthorizedPage } from '@pages/unauthorized';
import type { RouterContext } from './router-context';

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export const rootRoute = createRootRouteWithContext<RouterContext>()({
    notFoundComponent: NotFoundPage,
});

// ---------------------------------------------------------------------------
// Home — redirects based on auth state
// ---------------------------------------------------------------------------

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: ROUTE_PATHS.home,
    beforeLoad: ({ context }) => {
        throw redirect({
            to: context.isAuthenticated ? ROUTE_PATHS.dashboard : ROUTE_PATHS.login,
        });
    },
});

// ---------------------------------------------------------------------------
// Public layout (guest-only pages)
// ---------------------------------------------------------------------------

const publicLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'public',
    component: PublicLayout,
});

const loginRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: ROUTE_PATHS.login,
    beforeLoad: guestGuard,
    component: LoginPage,
});

// ---------------------------------------------------------------------------
// Protected layout (authenticated pages)
// ---------------------------------------------------------------------------

const protectedLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'protected',
    component: ProtectedLayout,
    beforeLoad: authGuard,
});

const dashboardRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: ROUTE_PATHS.dashboard,
    component: DashboardPage,
});

// ---------------------------------------------------------------------------
// Standalone routes (no layout wrapper)
// ---------------------------------------------------------------------------

const unauthorizedRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: ROUTE_PATHS.unauthorized,
    component: UnauthorizedPage,
});

// ---------------------------------------------------------------------------
// Route tree
// ---------------------------------------------------------------------------

export const routeTree = rootRoute.addChildren([
    homeRoute,
    publicLayoutRoute.addChildren([loginRoute]),
    protectedLayoutRoute.addChildren([dashboardRoute]),
    unauthorizedRoute,
]);
