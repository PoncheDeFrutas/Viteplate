import { useStore } from 'zustand';
import { sessionStore } from './store';
import type { SessionStore } from './store';

/**
 * React hook to select values from the session store.
 *
 * @example
 * ```tsx
 * const user = useSession((s) => s.user);
 * const isAuth = useSession((s) => s.isAuthenticated());
 * ```
 */
export function useSession<T>(selector: (state: SessionStore) => T): T {
    return useStore(sessionStore, selector);
}
