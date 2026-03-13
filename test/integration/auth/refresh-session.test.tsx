import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { sessionStore } from '@entities/session';
import { setSessionAdapter, resetSessionAdapter, resetRefreshState } from '@shared/api';
import { createSessionAdapter } from '@entities/session';
import { useRefreshSession } from '@features/auth/refresh-session';
import { ThemeProvider } from '@app/providers/theme';
import { clearMockSession } from '../../msw/handlers/auth';
import {
    MOCK_ADMIN_USER,
    generateMockAccessToken,
    generateMockRefreshToken,
} from '../../msw/fixtures';
import { server } from '../../msw/server';
import { http, HttpResponse } from 'msw';

// ---------------------------------------------------------------------------
// Helper: renders a component that uses useRefreshSession
// ---------------------------------------------------------------------------

function RefreshSessionTest({
    onResult,
}: {
    onResult: (result: { isLoading: boolean; error: unknown }) => void;
}) {
    const result = useRefreshSession();
    onResult(result);

    if (result.isLoading) {
        return <p>Refreshing...</p>;
    }

    if (result.error) {
        return <p>Refresh failed</p>;
    }

    return <p>Refresh complete</p>;
}

function renderRefreshTest() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0 },
            mutations: { retry: false },
        },
    });

    let latestResult: { isLoading: boolean; error: unknown } = { isLoading: true, error: null };

    const onResult = (result: { isLoading: boolean; error: unknown }) => {
        latestResult = result;
    };

    const renderResult = render(
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <RefreshSessionTest onResult={onResult} />
            </QueryClientProvider>
        </ThemeProvider>,
    );

    return { ...renderResult, getLatestResult: () => latestResult };
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
    sessionStore.getState().clearSession('manual_reset');
    resetRefreshState();
    resetSessionAdapter();
    setSessionAdapter(createSessionAdapter());
    clearMockSession();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Refresh session — boot-time recovery', () => {
    it('restores the session when a valid refresh cookie exists', async () => {
        // Simulate a server-side session (as if the user had a valid httpOnly cookie)
        // We need to pre-set the mock session so the /auth/refresh handler succeeds
        // and /users/me returns the user data.
        // We do this by temporarily overriding the refresh handler to succeed
        // and setting the mock session state.

        // Pre-seed a token so getRefreshToken returns 'httponly' (signals "attempt refresh")
        sessionStore.getState().setAccessToken('stale-token');

        // Override refresh handler to simulate a valid refresh cookie
        const freshAccessToken = generateMockAccessToken(MOCK_ADMIN_USER.id);
        const freshRefreshToken = generateMockRefreshToken(MOCK_ADMIN_USER.id);

        server.use(
            http.post('*/auth/refresh', () => {
                return HttpResponse.json({
                    accessToken: freshAccessToken,
                    refreshToken: freshRefreshToken,
                });
            }),
            http.get('*/users/me', ({ request }) => {
                const authHeader = request.headers.get('Authorization');
                if (authHeader === `Bearer ${freshAccessToken}`) {
                    return HttpResponse.json(MOCK_ADMIN_USER);
                }
                return HttpResponse.json({ message: 'Unauthorized.' }, { status: 401 });
            }),
        );

        renderRefreshTest();

        // Should start by showing loading
        expect(screen.getByText('Refreshing...')).toBeInTheDocument();

        // After refresh completes, session should be restored
        await waitFor(() => {
            expect(screen.getByText('Refresh complete')).toBeInTheDocument();
        });

        // Session store should have the new token and user
        const state = sessionStore.getState();
        expect(state.accessToken).toBe(freshAccessToken);
        expect(state.user?.name).toBe('Alice Admin');
        expect(state.user?.email).toBe('admin@viteplate.dev');
        expect(state.user?.role).toBe('admin');
    });

    it('clears the session when refresh fails (expired/invalid cookie)', async () => {
        // Pre-seed a token so the hook actually attempts the refresh
        sessionStore.getState().setAccessToken('stale-token');

        // Override refresh handler to return 401 (simulating expired refresh cookie)
        server.use(
            http.post('*/auth/refresh', () => {
                return HttpResponse.json({ message: 'No active session.' }, { status: 401 });
            }),
        );

        renderRefreshTest();

        expect(screen.getByText('Refreshing...')).toBeInTheDocument();

        // After failure, should show error state
        await waitFor(() => {
            expect(screen.getByText('Refresh failed')).toBeInTheDocument();
        });

        // Session should be fully cleared
        const state = sessionStore.getState();
        expect(state.accessToken).toBeNull();
        expect(state.user).toBeNull();
    });
});
