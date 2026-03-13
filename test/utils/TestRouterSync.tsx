import { useEffect, useMemo } from 'react';
import { useSession } from '@entities/session';
import type { RouterContext } from '@app/routers';
import type { createTestRouter } from './render';

/**
 * Inner component that subscribes to the Zustand session store and pushes
 * context updates into the TanStack Router via `router.update()`.
 *
 * This replicates the pattern used in `AppRouterProvider` / `App.tsx`:
 * the router is created once with a static context, and subsequent
 * session-state changes are propagated through `router.update()`.
 */
export function TestRouterSync({ router }: { router: ReturnType<typeof createTestRouter> }) {
    const accessToken = useSession((s) => s.accessToken);
    const role = useSession((s) => s.user?.role ?? null);

    const context: RouterContext = useMemo(
        () => ({
            isAuthenticated: accessToken !== null,
            role,
        }),
        [accessToken, role],
    );

    useEffect(() => {
        router.update({ context });
        void router.invalidate();
    }, [router, context]);

    return null;
}
