import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { sessionStore } from '@entities/session';
import { userQueryKeys } from '@entities/user';
import { resetRefreshState } from '@shared/api';
import { ROUTE_PATHS } from '@shared/config';
import { logout } from '../api';

/**
 * Mutation hook that handles the full logout flow:
 *
 *   1. POST to `/auth/logout` (invalidates the refresh cookie server-side).
 *   2. Clear the Zustand session store (access token + user).
 *   3. Reset the refresh controller state (pending queues, retry counters).
 *   4. Invalidate / remove all user-related queries from the cache.
 *   5. Navigate to the login page.
 *
 * Even if the server call fails (e.g., network error), the local cleanup
 * still runs so the user is logged out client-side.
 */
export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logout,
        onSettled: () => {
            // Always clean up locally, even if the server request failed.
            sessionStore.getState().clearSession('logout');
            resetRefreshState();
            queryClient.removeQueries({ queryKey: userQueryKeys.all });

            void navigate({ to: ROUTE_PATHS.login });
        },
    });
}
