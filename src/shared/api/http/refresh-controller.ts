import { clearSession, getSessionAdapter } from './session-adapter';

const MAX_REFRESH_ATTEMPTS = 2;

interface QueueEntry {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}

let isRefreshing = false;
let refreshAttempts = 0;
let pendingQueue: QueueEntry[] = [];

function drainQueue(token: string): void {
    for (const entry of pendingQueue) {
        entry.resolve(token);
    }
    pendingQueue = [];
}

function rejectQueue(error: unknown): void {
    for (const entry of pendingQueue) {
        entry.reject(error);
    }
    pendingQueue = [];
}

export function resetRefreshState(): void {
    isRefreshing = false;
    refreshAttempts = 0;
    pendingQueue = [];
}

export type RefreshFn = () => Promise<{ accessToken: string; refreshToken: string }>;

/**
 * Handles a failed refresh attempt. If the max retry limit has been reached,
 * clears the session and resets state. This is the single place where
 * max-attempts-reached logic lives — `handleUnauthorized` delegates here
 * to avoid duplicating the cleanup path.
 */
function rejectRefresh(error: unknown): void {
    isRefreshing = false;

    let rejectionError = error;

    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        try {
            clearSession('refresh_failed');
        } catch (clearError: unknown) {
            rejectionError = clearError;
        }
        refreshAttempts = 0;
    }

    rejectQueue(rejectionError);
}

export function handleUnauthorized(refreshFn: RefreshFn): Promise<string> {
    // If a refresh is already in flight, queue this caller behind it.
    if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
            pendingQueue.push({ resolve, reject });
        });
    }

    // A fresh 401 cycle (isRefreshing was false) means the previous cycle
    // either succeeded (which resets attempts to 0) or the caller is hitting
    // a new 401 after some time. Reset the counter so this cycle gets a full
    // MAX_REFRESH_ATTEMPTS budget rather than inheriting stale state from a
    // prior partial failure.
    refreshAttempts = 0;

    isRefreshing = true;
    refreshAttempts++;

    return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });

        Promise.resolve()
            .then(refreshFn)
            .then(({ accessToken, refreshToken }) => {
                getSessionAdapter().setTokens(accessToken, refreshToken);
                isRefreshing = false;
                refreshAttempts = 0;
                drainQueue(accessToken);
            })
            .catch((refreshError: unknown) => {
                rejectRefresh(refreshError);
            });
    });
}
