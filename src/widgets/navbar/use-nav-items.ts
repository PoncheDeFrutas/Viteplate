import { useSession } from '@entities/session';
import { getNavItemsForRole } from './nav-config';
import type { NavItem } from './nav-config';
import type { Role } from '@entities/user';

interface UseNavItemsResult {
    items: NavItem[];
    userName: string | null;
    isAuthenticated: boolean;
}

/**
 * Resolves the navigation items for the current user based on their role.
 */
export function useNavItems(): UseNavItemsResult {
    const user = useSession((s) => s.user);
    const isAuthenticated = useSession((s) => s.isAuthenticated());

    const items = isAuthenticated && user ? getNavItemsForRole(user.role as Role) : [];
    const userName = user?.name ?? null;

    return { items, userName, isAuthenticated };
}
