export type SessionCleanupReason =
    | 'logout'
    | 'missing_refresh_token'
    | 'refresh_failed'
    | 'manual_reset';

export interface SessionAdapter {
    getAccessToken: () => string | null;
    getRefreshToken: () => string | null;
    setTokens: (accessToken: string, refreshToken: string) => void;
    clearSession?: (reason: SessionCleanupReason) => void;
    clearTokens?: () => void;
}

const defaultSessionAdapter: SessionAdapter = {
    getAccessToken: () => null,
    getRefreshToken: () => null,
    setTokens: () => undefined,
    clearSession: () => undefined,
    clearTokens: () => undefined,
};

let _adapter: SessionAdapter = defaultSessionAdapter;

export function setSessionAdapter(adapter: SessionAdapter): void {
    _adapter = adapter;
}

export function resetSessionAdapter(): void {
    _adapter = defaultSessionAdapter;
}

export function getSessionAdapter(): SessionAdapter {
    return _adapter;
}

export function clearSession(reason: SessionCleanupReason): void {
    if (_adapter.clearSession) {
        _adapter.clearSession(reason);
        return;
    }

    _adapter.clearTokens?.();
}
