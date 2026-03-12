export interface SessionAdapter {
    getAccessToken: () => string | null;
    getRefreshToken: () => string | null;
    setTokens: (accessToken: string, refreshToken: string) => void;
    clearTokens: () => void;
}

let _adapter: SessionAdapter | null = null;

export function setSessionAdapter(adapter: SessionAdapter): void {
    _adapter = adapter;
}

export function getSessionAdapter(): SessionAdapter {
    if (!_adapter) {
        throw new Error(
            '[http] SessionAdapter is not set. Please call setSessionAdapter() before using it.',
        );
    }
    return _adapter;
}
