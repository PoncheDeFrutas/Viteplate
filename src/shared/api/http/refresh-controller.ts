import { getSessionAdapter } from './session-adapter';

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

function rejectRefresh(error: unknown): void {
    isRefreshing = false;

    let rejectionError = error;

    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        try {
            getSessionAdapter().clearTokens();
        } catch (clearError: unknown) {
            rejectionError = clearError;
        } finally {
            refreshAttempts = 0;
        }
    }

    rejectQueue(rejectionError);
}

export function handleUnauthorized(refreshFn: RefreshFn): Promise<string> {
    if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
            pendingQueue.push({ resolve, reject });
        });
    }

    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        getSessionAdapter().clearTokens();
        resetRefreshState();
        return Promise.reject(new Error('Max refresh attempts reached. Session cleared.'));
    }

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
