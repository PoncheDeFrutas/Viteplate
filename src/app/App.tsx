import { useMemo } from 'react';
import { useSession } from '@entities/session';
import { useRefreshSession } from '@features/auth/refresh-session';
import { QueryProvider } from './providers/query';
import { AppRouterProvider } from './providers/router';
import { ThemeProvider } from './providers/theme';
import type { RouterContext } from './routers';

/**
 * Root application component.
 *
 * Composes global providers in the correct order:
 *   ThemeProvider → QueryProvider → AppRouterProvider
 *
 * On mount, attempts to restore the user's session via the httpOnly
 * refresh-token cookie. The router is not rendered until this attempt
 * completes, preventing a flash of the login page for users with a
 * valid session.
 */
export function App() {
    const { isLoading } = useRefreshSession();

    const accessToken = useSession((s) => s.accessToken);
    const role = useSession((s) => s.user?.role ?? null);

    const routerContext: RouterContext = useMemo(
        () => ({
            isAuthenticated: accessToken !== null,
            role,
        }),
        [accessToken, role],
    );

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
        );
    }

    return (
        <ThemeProvider>
            <QueryProvider>
                <AppRouterProvider context={routerContext} />
            </QueryProvider>
        </ThemeProvider>
    );
}
