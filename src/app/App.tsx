import { useMemo } from 'react';
import { QueryProvider } from './providers/query';
import { AppRouterProvider } from './providers/router';
import type { RouterContext } from './routers';

/**
 * Root application component.
 *
 * Composes global providers in the correct order:
 *   QueryProvider → AppRouterProvider
 *
 * The router context is currently hardcoded as unauthenticated.
 * Once the session store (Zustand) is implemented, it will provide
 * real `isAuthenticated` and `role` values here.
 */
export function App() {
    // TODO: Replace with values from the session store once implemented
    const routerContext: RouterContext = useMemo(
        () => ({
            isAuthenticated: false,
            role: null,
        }),
        [],
    );

    return (
        <QueryProvider>
            <AppRouterProvider context={routerContext} />
        </QueryProvider>
    );
}
