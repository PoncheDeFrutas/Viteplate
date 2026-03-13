import { lazy, Suspense, useEffect, useState } from 'react';
import { createRouter, RouterProvider as TanStackRouterProvider } from '@tanstack/react-router';
import { routeTree } from '../../routers';
import type { RouterContext } from '../../routers';

const RouterDevtools = import.meta.env.DEV
    ? lazy(() =>
          import('@tanstack/router-devtools').then((mod) => ({
              default: mod.TanStackRouterDevtools,
          })),
      )
    : () => null;

function createAppRouter(context: RouterContext) {
    return createRouter({
        routeTree,
        context,
        defaultPreload: 'intent',
    });
}

// Register the router for type-safe navigation across the app
declare module '@tanstack/react-router' {
    interface Register {
        router: ReturnType<typeof createAppRouter>;
    }
}

interface AppRouterProviderProps {
    context: RouterContext;
}

/**
 * Creates the TanStack Router instance and keeps its context in sync
 * with the current auth state. The router is created once on first render;
 * subsequent context changes are pushed via `router.update()`.
 */
export function AppRouterProvider({ context }: AppRouterProviderProps) {
    const [router] = useState(() => createAppRouter(context));

    useEffect(() => {
        router.update({ context });
    }, [router, context]);

    return (
        <>
            <TanStackRouterProvider router={router} />
            <Suspense>
                <RouterDevtools router={router} position="bottom-right" />
            </Suspense>
        </>
    );
}
