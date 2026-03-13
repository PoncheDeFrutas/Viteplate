import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@app/routers/route-tree';
import { ThemeProvider } from '@app/providers/theme';
import { TestRouterSync } from './TestRouterSync';
import type { RouterContext } from '@app/routers';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Query client factory (no retries, no caching delays for tests)
// ---------------------------------------------------------------------------

export function createTestQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0,
            },
            mutations: {
                retry: false,
            },
        },
    });
}

// ---------------------------------------------------------------------------
// Router factory with memory history
// ---------------------------------------------------------------------------

interface CreateTestRouterOptions {
    context?: RouterContext;
    initialPath?: string;
}

export function createTestRouter(options?: CreateTestRouterOptions) {
    const context: RouterContext = options?.context ?? {
        isAuthenticated: false,
        role: null,
    };

    const memoryHistory = createMemoryHistory({
        initialEntries: [options?.initialPath ?? '/'],
    });

    return createRouter({
        routeTree,
        context,
        history: memoryHistory,
    });
}

// ---------------------------------------------------------------------------
// Full-app render helper
// ---------------------------------------------------------------------------

interface RenderAppOptions {
    initialPath?: string;
    context?: RouterContext;
    queryClient?: QueryClient;
}

/**
 * Renders the application's route tree wrapped in all required providers.
 *
 * This does NOT render `<App />` (which includes `useRefreshSession`).
 * Instead it renders the router directly, giving tests full control
 * over session state before rendering.
 *
 * A `TestRouterSync` component keeps the router context in sync with
 * the Zustand session store, so guards re-evaluate after login/logout.
 *
 * Use this for integration tests that need the full route tree, guards,
 * and layouts.
 */
export function renderApp(options?: RenderAppOptions) {
    const queryClient = options?.queryClient ?? createTestQueryClient();
    const router = createTestRouter({
        context: options?.context,
        initialPath: options?.initialPath,
    });

    const result = render(
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <TestRouterSync router={router} />
                <RouterProvider router={router} />
            </QueryClientProvider>
        </ThemeProvider>,
    );

    return { ...result, router, queryClient };
}

// ---------------------------------------------------------------------------
// Simple wrapper for component-level tests
// ---------------------------------------------------------------------------

interface RenderWithProvidersOptions {
    queryClient?: QueryClient;
}

/**
 * Wraps a component in QueryClientProvider + ThemeProvider.
 * Use for unit/component tests that don't need routing.
 */
export function renderWithProviders(ui: ReactNode, options?: RenderWithProvidersOptions) {
    const queryClient = options?.queryClient ?? createTestQueryClient();

    const result = render(
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
        </ThemeProvider>,
    );

    return { ...result, queryClient };
}
