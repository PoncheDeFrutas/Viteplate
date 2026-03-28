import type { RouterContext } from '../routers/router-context';

/**
 * Redirects authenticated users away from guest-only pages (e.g., login).
 * Sends each user to their role-specific home page.
 * Use in `beforeLoad` of routes that should only be accessible to unauthenticated users.
 */
export function guestGuard({ context }: { context: RouterContext }): void {
    if (context.isAuthenticated) {
    }
}
