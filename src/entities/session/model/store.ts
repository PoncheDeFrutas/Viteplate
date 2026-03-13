import { createStore } from 'zustand/vanilla';
import type { User, Role } from '@entities/user';
import type { SessionAdapter, SessionCleanupReason } from '@shared/api';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export interface SessionState {
    accessToken: string | null;
    user: User | null;
}

export interface SessionActions {
    setAccessToken: (token: string) => void;
    setUser: (user: User) => void;
    clearSession: (reason: SessionCleanupReason) => void;
    hasRole: (role: Role) => boolean;
    isAuthenticated: () => boolean;
}

export type SessionStore = SessionState & SessionActions;

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const INITIAL_STATE: SessionState = {
    accessToken: null,
    user: null,
};

// ---------------------------------------------------------------------------
// Store (vanilla — framework-agnostic, can be used outside React)
// ---------------------------------------------------------------------------

export const sessionStore = createStore<SessionStore>()((set, get) => ({
    ...INITIAL_STATE,

    setAccessToken: (token) => {
        set({ accessToken: token });
    },

    setUser: (user) => {
        set({ user });
    },

    clearSession: () => {
        set({ ...INITIAL_STATE });
    },

    hasRole: (role) => {
        return get().user?.role === role;
    },

    isAuthenticated: () => {
        return get().accessToken !== null;
    },
}));

// ---------------------------------------------------------------------------
// Session adapter bridge
// ---------------------------------------------------------------------------

/**
 * Creates a `SessionAdapter` backed by the Zustand session store.
 *
 * - `getAccessToken` reads the in-memory access token.
 * - `getRefreshToken` returns a sentinel value (`"httponly"`) when the user
 *   has an active session. The actual refresh token lives in an `httpOnly`
 *   cookie managed by the backend; the frontend never reads it directly.
 *   The sentinel tells the auth interceptor "yes, attempt a refresh".
 * - `setTokens` stores only the access token in memory. The refresh token
 *   parameter is ignored because the backend sets it as an `httpOnly` cookie.
 * - `clearSession` resets the store and can trigger side-effects (e.g., redirect).
 */
export function createSessionAdapter(): SessionAdapter {
    return {
        getAccessToken: () => sessionStore.getState().accessToken,

        getRefreshToken: () => {
            // If the user has an access token, assume the httpOnly refresh
            // cookie is also present. Return a non-null sentinel so the
            // auth interceptor proceeds with the refresh attempt.
            return sessionStore.getState().accessToken !== null ? 'httponly' : null;
        },

        setTokens: (accessToken: string) => {
            sessionStore.getState().setAccessToken(accessToken);
        },

        clearSession: (reason: SessionCleanupReason) => {
            sessionStore.getState().clearSession(reason);
        },
    };
}
