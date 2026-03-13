import { sessionStore } from '@entities/session';
import { resetRefreshState, resetSessionAdapter, setSessionAdapter } from '@shared/api';
import { createSessionAdapter } from '@entities/session';
import { clearMockSession } from '../msw/handlers/auth';

/**
 * Resets all auth-related state between tests:
 * - Zustand session store (access token, user)
 * - HTTP refresh controller (pending queue, retry counters)
 * - Session adapter (re-plugs a fresh adapter)
 * - MSW mock server session (in-memory server state)
 *
 * Call this in `beforeEach` for any test that touches auth.
 */
export function resetAuthState(): void {
    sessionStore.getState().clearSession('manual_reset');
    resetRefreshState();
    resetSessionAdapter();
    setSessionAdapter(createSessionAdapter());
    clearMockSession();
}
