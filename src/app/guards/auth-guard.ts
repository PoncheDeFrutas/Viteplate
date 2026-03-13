import { redirect } from '@tanstack/react-router';
import { ROUTE_PATHS } from '@shared/config';
import type { RouterContext } from '../routers/router-context';

/**
 * Redirects unauthenticated users to the login page.
 * Use in `beforeLoad` of any route that requires authentication.
 */
export function authGuard({ context }: { context: RouterContext }): void {
    if (!context.isAuthenticated) {
        throw redirect({ to: ROUTE_PATHS.login });
    }
}
