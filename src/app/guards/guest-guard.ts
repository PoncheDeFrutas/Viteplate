import { redirect } from '@tanstack/react-router';
import { ROUTE_PATHS } from '@shared/config';
import type { RouterContext } from '../routers/router-context';

/**
 * Redirects authenticated users away from guest-only pages (e.g., login).
 * Use in `beforeLoad` of routes that should only be accessible to unauthenticated users.
 */
export function guestGuard({ context }: { context: RouterContext }): void {
    if (context.isAuthenticated) {
        throw redirect({ to: ROUTE_PATHS.dashboard });
    }
}
