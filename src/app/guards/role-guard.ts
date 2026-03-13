import { redirect } from '@tanstack/react-router';
import { ROUTE_PATHS } from '@shared/config';
import type { RouterContext } from '../routers/router-context';

/**
 * Creates a guard that checks if the authenticated user has one of the allowed roles.
 * Redirects to the unauthorized page if the role does not match.
 *
 * Must be used after `authGuard` — assumes the user is already authenticated.
 *
 * @example
 * ```ts
 * beforeLoad: (opts) => {
 *     authGuard(opts);
 *     createRoleGuard('admin')(opts);
 * }
 * ```
 */
export function createRoleGuard(...allowedRoles: string[]) {
    return ({ context }: { context: RouterContext }): void => {
        if (!context.role || !allowedRoles.includes(context.role)) {
            throw redirect({ to: ROUTE_PATHS.unauthorized });
        }
    };
}
