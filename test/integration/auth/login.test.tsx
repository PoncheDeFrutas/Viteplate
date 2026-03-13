import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { sessionStore } from '@entities/session';
import { renderApp, resetAuthState } from '../../utils';

beforeEach(() => {
    resetAuthState();
});

// ---------------------------------------------------------------------------
// Happy path
// ---------------------------------------------------------------------------

describe('Login — happy path', () => {
    it('logs in with admin credentials and navigates to admin dashboard', async () => {
        const user = userEvent.setup();
        renderApp({ initialPath: '/login' });

        // Wait for the login page to render
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        });

        // Fill in credentials
        await user.type(screen.getByLabelText(/email/i), 'admin@viteplate.dev');
        await user.type(screen.getByLabelText(/password/i), 'admin123');

        // Submit
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        // Should navigate to admin dashboard
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
        });

        // Session store should be populated
        const state = sessionStore.getState();
        expect(state.accessToken).not.toBeNull();
        expect(state.user?.name).toBe('Alice Admin');
        expect(state.user?.role).toBe('admin');
    });

    it('logs in with regular user credentials and navigates to user dashboard', async () => {
        const user = userEvent.setup();
        renderApp({ initialPath: '/login' });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        });

        await user.type(screen.getByLabelText(/email/i), 'user@viteplate.dev');
        await user.type(screen.getByLabelText(/password/i), 'user123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /^dashboard$/i })).toBeInTheDocument();
        });

        const state = sessionStore.getState();
        expect(state.user?.name).toBe('Bob User');
        expect(state.user?.role).toBe('user');
    });

    it('logs in with viewer credentials and navigates to overview', async () => {
        const user = userEvent.setup();
        renderApp({ initialPath: '/login' });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        });

        await user.type(screen.getByLabelText(/email/i), 'viewer@viteplate.dev');
        await user.type(screen.getByLabelText(/password/i), 'viewer123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /overview/i })).toBeInTheDocument();
        });

        const state = sessionStore.getState();
        expect(state.user?.name).toBe('Carol Viewer');
        expect(state.user?.role).toBe('viewer');
    });
});

// ---------------------------------------------------------------------------
// Failure cases
// ---------------------------------------------------------------------------

describe('Login — failure cases', () => {
    it('shows an error for wrong password', async () => {
        const user = userEvent.setup();
        renderApp({ initialPath: '/login' });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        });

        await user.type(screen.getByLabelText(/email/i), 'admin@viteplate.dev');
        await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        // Should show a server error, not navigate
        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        // Should still be on login page
        expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();

        // Session should remain empty
        expect(sessionStore.getState().accessToken).toBeNull();
    });

    it('shows an error for unknown email', async () => {
        const user = userEvent.setup();
        renderApp({ initialPath: '/login' });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        });

        await user.type(screen.getByLabelText(/email/i), 'nobody@viteplate.dev');
        await user.type(screen.getByLabelText(/password/i), 'somepassword');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        expect(sessionStore.getState().accessToken).toBeNull();
    });
});
