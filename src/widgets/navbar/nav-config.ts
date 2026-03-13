import { ROUTE_PATHS } from '@shared/config';
import type { Role } from '@entities/user';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NavItem {
    label: string;
    to: string;
}

// ---------------------------------------------------------------------------
// Navigation config per context
// ---------------------------------------------------------------------------

export const PUBLIC_NAV_ITEMS: NavItem[] = [
    { label: 'Home', to: ROUTE_PATHS.home },
    { label: 'About', to: ROUTE_PATHS.about },
    { label: 'Stack', to: ROUTE_PATHS.stack },
    { label: 'Sign in', to: ROUTE_PATHS.login },
    // Dev-only link — tree-shaken from production builds
    ...(import.meta.env.DEV ? [{ label: 'Design System', to: ROUTE_PATHS.designSystem }] : []),
];

const ADMIN_NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', to: ROUTE_PATHS.admin },
    { label: 'Settings', to: ROUTE_PATHS.adminSettings },
];

const USER_NAV_ITEMS: NavItem[] = [{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }];

const VIEWER_NAV_ITEMS: NavItem[] = [{ label: 'Overview', to: ROUTE_PATHS.overview }];

const NAV_ITEMS_BY_ROLE: Record<Role, NavItem[]> = {
    admin: ADMIN_NAV_ITEMS,
    user: USER_NAV_ITEMS,
    viewer: VIEWER_NAV_ITEMS,
};

/**
 * Returns the nav items for the given role.
 * Falls back to regular user nav items for unknown roles.
 */
export function getNavItemsForRole(role: Role): NavItem[] {
    return NAV_ITEMS_BY_ROLE[role] ?? USER_NAV_ITEMS;
}
