import { useMemo } from 'react';
import { useSession } from '@entities/session';
import { QueryProvider } from './providers/query';
import { AppRouterProvider } from './providers/router';
import type { RouterContext } from './routers';

/**
 * Root application component.
 *
 * Composes global providers in the correct order:
 *   QueryProvider → AppRouterProvider
 *
 * Router context is derived from the Zustand session store so that
 * guards react to auth state changes in real time.
 */
export function App() {
    const accessToken = useSession((s) => s.accessToken);
    const role = useSession((s) => s.user?.role ?? null);

    const routerContext: RouterContext = useMemo(
        () => ({
            isAuthenticated: accessToken !== null,
            role,
        }),
        [accessToken, role],
    );

    return (
        <QueryProvider>
            <AppRouterProvider context={routerContext} />
        </QueryProvider>
    );
}
