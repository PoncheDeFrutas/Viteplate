import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { sessionStore } from '@entities/session';
import { renderApp, resetAuthState } from '../../utils';
import { MOCK_ADMIN_USER, MOCK_REGULAR_USER, MOCK_VIEWER_USER } from '../../msw/fixtures';

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

        expect(screen.queryByRole('heading', { name: /dashboard/i })).not.toBeInTheDocument();
    });

    it('redirects unauthenticated users from /admin to /login', async () => {
        renderApp({ initialPath: '/admin' });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        });
    });

    it('redirects unauthenticated users from /overview to /login', async () => {
        renderApp({ initialPath: '/overview' });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        });
    });
});

// ---------------------------------------------------------------------------
// Guest guard
// ---------------------------------------------------------------------------

describe('Guest guard', () => {
    it('redirects authenticated admin from /login to /admin', async () => {
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

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
        });

        expect(screen.queryByRole('heading', { name: /sign in/i })).not.toBeInTheDocument();
    });

    it('redirects authenticated regular user from /login to /dashboard', async () => {
        sessionStore.getState().setAccessToken('mock-access-token-2-1');
        sessionStore.getState().setUser({
            id: MOCK_REGULAR_USER.id,
            email: MOCK_REGULAR_USER.email,
            name: MOCK_REGULAR_USER.name,
            role: MOCK_REGULAR_USER.role,
        });

        renderApp({
            initialPath: '/login',
            context: { isAuthenticated: true, role: 'user' },
        });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /^dashboard$/i })).toBeInTheDocument();
        });
    });

    it('redirects authenticated viewer from /login to /overview', async () => {
        sessionStore.getState().setAccessToken('mock-access-token-3-1');
        sessionStore.getState().setUser({
            id: MOCK_VIEWER_USER.id,
            email: MOCK_VIEWER_USER.email,
            name: MOCK_VIEWER_USER.name,
            role: MOCK_VIEWER_USER.role,
        });

        renderApp({
            initialPath: '/login',
            context: { isAuthenticated: true, role: 'viewer' },
        });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /overview/i })).toBeInTheDocument();
        });
    });
});

// ---------------------------------------------------------------------------
// Role guard
// ---------------------------------------------------------------------------

describe('Role guard', () => {
    it('redirects a regular user from /admin to /unauthorized', async () => {
        sessionStore.getState().setAccessToken('mock-access-token-2-1');
        sessionStore.getState().setUser({
            id: MOCK_REGULAR_USER.id,
            email: MOCK_REGULAR_USER.email,
            name: MOCK_REGULAR_USER.name,
            role: MOCK_REGULAR_USER.role,
        });

        renderApp({
            initialPath: '/admin',
            context: { isAuthenticated: true, role: 'user' },
        });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /unauthorized/i })).toBeInTheDocument();
        });
    });

    it('redirects a viewer from /dashboard to /unauthorized', async () => {
        sessionStore.getState().setAccessToken('mock-access-token-3-1');
        sessionStore.getState().setUser({
            id: MOCK_VIEWER_USER.id,
            email: MOCK_VIEWER_USER.email,
            name: MOCK_VIEWER_USER.name,
            role: MOCK_VIEWER_USER.role,
        });

        renderApp({
            initialPath: '/dashboard',
            context: { isAuthenticated: true, role: 'viewer' },
        });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /unauthorized/i })).toBeInTheDocument();
        });
    });
});

// ---------------------------------------------------------------------------
// Home redirect
// ---------------------------------------------------------------------------

describe('Home route (/)', () => {
    it('shows the home page for unauthenticated users', async () => {
        renderApp({ initialPath: '/' });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /viteplate/i })).toBeInTheDocument();
        });
    });

    it('redirects authenticated admin to /admin', async () => {
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
            expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
        });
    });

    it('redirects authenticated regular user to /dashboard', async () => {
        sessionStore.getState().setAccessToken('mock-access-token-2-1');
        sessionStore.getState().setUser({
            id: MOCK_REGULAR_USER.id,
            email: MOCK_REGULAR_USER.email,
            name: MOCK_REGULAR_USER.name,
            role: MOCK_REGULAR_USER.role,
        });

        renderApp({
            initialPath: '/',
            context: { isAuthenticated: true, role: 'user' },
        });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /^dashboard$/i })).toBeInTheDocument();
        });
    });

    it('redirects authenticated viewer to /overview', async () => {
        sessionStore.getState().setAccessToken('mock-access-token-3-1');
        sessionStore.getState().setUser({
            id: MOCK_VIEWER_USER.id,
            email: MOCK_VIEWER_USER.email,
            name: MOCK_VIEWER_USER.name,
            role: MOCK_VIEWER_USER.role,
        });

        renderApp({
            initialPath: '/',
            context: { isAuthenticated: true, role: 'viewer' },
        });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /overview/i })).toBeInTheDocument();
        });
    });
});

// ---------------------------------------------------------------------------
// Full flow: login then navigate back to /login should be blocked
// ---------------------------------------------------------------------------

describe('Guard enforcement after login', () => {
    it('prevents navigating to /login after successful admin login', async () => {
        const user = userEvent.setup();
        const { router } = renderApp({ initialPath: '/login' });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        });

        await user.type(screen.getByLabelText(/email/i), 'admin@viteplate.dev');
        await user.type(screen.getByLabelText(/password/i), 'admin123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
        });

        // Try navigating to /login programmatically
        void router.navigate({ to: '/login' });

        // Guest guard should redirect back to admin dashboard
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
        });

        expect(screen.queryByRole('heading', { name: /sign in/i })).not.toBeInTheDocument();
    });
});
