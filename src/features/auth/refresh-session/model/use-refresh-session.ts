import { useCallback, useEffect, useRef, useState } from 'react';
import { sessionStore } from '@entities/session';
import { getUserMe } from '@entities/user';
import { refreshSession } from '../api';

interface UseRefreshSessionResult {
    /** `true` while the initial session recovery is in flight. */
    isLoading: boolean;
    /** The error if session recovery failed (null when not attempted or succeeded). */
    error: unknown;
}

/**
 * Attempts to restore the user's session on app boot.
 *
 * Flow:
 *   1. POST `/auth/refresh` with the httpOnly cookie (via `withCredentials`).
 *   2. On success, store the access token in the Zustand session store.
 *   3. GET `/users/me` to hydrate the user profile.
 *   4. On failure at any step, silently clear state — the user lands on login.
 *
 * This hook runs exactly once (on mount) and exposes `isLoading` so the
 * app can gate router rendering until the attempt completes.
 */
export function useRefreshSession(): UseRefreshSessionResult {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);
    const attempted = useRef(false);

    const attempt = useCallback(async () => {
        try {
            const { accessToken } = await refreshSession();
            sessionStore.getState().setAccessToken(accessToken);

            const user = await getUserMe();
            sessionStore.getState().setUser(user);
        } catch (err: unknown) {
            // Refresh failed — no valid session. Clear any stale state.
            sessionStore.getState().clearSession('refresh_failed');
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Prevent double-execution in React 18+ StrictMode dev re-mounts.
        if (attempted.current) {
            return;
        }
        attempted.current = true;
        void attempt();
    }, [attempt]);

    return { isLoading, error };
}
