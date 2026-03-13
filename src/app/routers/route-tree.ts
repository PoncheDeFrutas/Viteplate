import { createRootRouteWithContext, createRoute, redirect } from '@tanstack/react-router';
import { ROUTE_PATHS, getRoleHomePath } from '@shared/config';
import { authGuard, guestGuard, createRoleGuard } from '../guards';
import { PublicLayout } from '../layouts/PublicLayout';
import { ProtectedLayout } from '../layouts/ProtectedLayout';
import { HomePage } from '@pages/home';
import { AboutPage } from '@pages/about';
import { StackPage } from '@pages/stack';
import { LoginPage } from '@pages/login';
import { DashboardPage } from '@pages/dashboard';
import { AdminDashboardPage } from '@pages/admin';
import { AdminSettingsPage } from '@pages/admin-settings';
import { ViewerDashboardPage } from '@pages/viewer';
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
// Public layout (guest-facing pages)
// ---------------------------------------------------------------------------

const publicLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'public',
    component: PublicLayout,
});

// Home — public landing for guests, role-aware redirect for authenticated users
const homeRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: ROUTE_PATHS.home,
    beforeLoad: ({ context }) => {
        if (context.isAuthenticated) {
            throw redirect({ to: getRoleHomePath(context.role) });
        }
    },
    component: HomePage,
});

const aboutRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: ROUTE_PATHS.about,
    component: AboutPage,
});

const stackRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: ROUTE_PATHS.stack,
    component: StackPage,
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

// User dashboard — accessible by role "user"
const dashboardRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: ROUTE_PATHS.dashboard,
    beforeLoad: createRoleGuard('user'),
    component: DashboardPage,
});

// Admin layout route — groups admin routes under a single role guard
const adminLayoutRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    id: 'admin-layout',
    beforeLoad: createRoleGuard('admin'),
});

const adminDashboardRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: ROUTE_PATHS.admin,
    component: AdminDashboardPage,
});

const adminSettingsRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: ROUTE_PATHS.adminSettings,
    component: AdminSettingsPage,
});

// Viewer overview — accessible by role "viewer"
const viewerOverviewRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    path: ROUTE_PATHS.overview,
    beforeLoad: createRoleGuard('viewer'),
    component: ViewerDashboardPage,
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
    publicLayoutRoute.addChildren([homeRoute, aboutRoute, stackRoute, loginRoute]),
    protectedLayoutRoute.addChildren([
        dashboardRoute,
        adminLayoutRoute.addChildren([adminDashboardRoute, adminSettingsRoute]),
        viewerOverviewRoute,
    ]),
    unauthorizedRoute,
]);
