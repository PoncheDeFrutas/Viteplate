import { createRouter, RouterProvider as TanStackRouterProvider } from '@tanstack/react-router';
import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import type { RouterContext } from '../../routers';
import { routeTree } from '../../routers';

function createAppRouter(context: RouterContext) {
    return createRouter({
        routeTree,
        context,
        defaultPreload: 'intent',
        scrollRestoration: true,
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

interface RouterDevtoolsProps {
    router: ReturnType<typeof createAppRouter>;
    position?: string;
}

type RouterDevtoolsComponent = ComponentType<RouterDevtoolsProps>;

/**
 * Creates the TanStack Router instance and keeps its context in sync
 * with the current auth state. The router is created once on first render;
 * subsequent context changes are pushed via `router.update()`.
 */
export function AppRouterProvider({ context }: AppRouterProviderProps) {
    const [router] = useState(() => createAppRouter(context));
    const [RouterDevtools, setRouterDevtools] = useState<RouterDevtoolsComponent | null>(null);

    useEffect(() => {
        router.update({ context });
    }, [router, context]);

    useEffect(() => {
        if (!import.meta.env.DEV) {
            return;
        }

        const devtoolsModule = '@tanstack/router-devtools';

        void import(/* @vite-ignore */ devtoolsModule)
            .then((mod: unknown) => {
                const maybeDevtools = (mod as { TanStackRouterDevtools?: RouterDevtoolsComponent })
                    .TanStackRouterDevtools;

                if (maybeDevtools) {
                    setRouterDevtools(() => maybeDevtools);
                }
            })
            .catch(() => {
                setRouterDevtools(null);
            });
    }, []);

    return (
        <>
            <TanStackRouterProvider router={router} />
            {RouterDevtools ? <RouterDevtools router={router} position="bottom-right" /> : null}
        </>
    );
}
