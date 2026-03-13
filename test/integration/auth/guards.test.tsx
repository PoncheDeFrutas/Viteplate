import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { sessionStore } from '@entities/session';
import { renderApp, resetAuthState } from '../../utils';
import { MOCK_ADMIN_USER } from '../../msw/fixtures';

beforeEach(() => {
    resetAuthState();
});

// ---------------------------------------------------------------------------
// Auth guard
// ---------------------------------------------------------------------------

describe('Auth guard', () => {
    it('redirects unauthenticated users from /dashboard to /login', async () => {
        renderApp({ initialPath: '/dashboard' });

        // Should be redirected to the login page since there is no session
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        });

        // Dashboard heading should NOT be present
        expect(screen.queryByRole('heading', { name: /dashboard/i })).not.toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// Guest guard
// ---------------------------------------------------------------------------

describe('Guest guard', () => {
    it('redirects authenticated users from /login to /dashboard', async () => {
        // Pre-populate session to simulate an already-authenticated user
        sessionStore.getState().setAccessToken('mock-access-token-1-1');
        sessionStore.getState().setUser({
            id: MOCK_ADMIN_USER.id,
            email: MOCK_ADMIN_USER.email,
            name: MOCK_ADMIN_USER.name,
            role: MOCK_ADMIN_USER.role,
        });

        renderApp({
            initialPath: '/login',
            context: { isAuthenticated: true, role: 'admin' },
        });

        // Should be redirected to dashboard since the user is authenticated
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
        });

        // Login form should NOT be present
        expect(screen.queryByRole('heading', { name: /sign in/i })).not.toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// Home redirect
// ---------------------------------------------------------------------------

describe('Home route (/)', () => {
    it('redirects unauthenticated users to /login', async () => {
        renderApp({ initialPath: '/' });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        });
    });

    it('redirects authenticated users to /dashboard', async () => {
        sessionStore.getState().setAccessToken('mock-access-token-1-1');
        sessionStore.getState().setUser({
            id: MOCK_ADMIN_USER.id,
            email: MOCK_ADMIN_USER.email,
            name: MOCK_ADMIN_USER.name,
            role: MOCK_ADMIN_USER.role,
        });

        renderApp({
            initialPath: '/',
            context: { isAuthenticated: true, role: 'admin' },
        });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
        });
    });
});

// ---------------------------------------------------------------------------
// Full flow: login then navigate back to /login should be blocked
// ---------------------------------------------------------------------------

describe('Guard enforcement after login', () => {
    it('prevents navigating to /login after successful login', async () => {
        const user = userEvent.setup();
        const { router } = renderApp({ initialPath: '/login' });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        });

        await user.type(screen.getByLabelText(/email/i), 'admin@viteplate.dev');
        await user.type(screen.getByLabelText(/password/i), 'admin123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
        });

        // Try navigating to /login programmatically
        void router.navigate({ to: '/login' });

        // Guest guard should redirect back to dashboard
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
        });

        expect(screen.queryByRole('heading', { name: /sign in/i })).not.toBeInTheDocument();
    });
});
