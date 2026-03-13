import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { sessionStore } from '@entities/session';
import { renderApp, resetAuthState } from '../../utils';

beforeEach(() => {
    resetAuthState();
});

describe('Logout', () => {
    it('clears the session and redirects to the login page', async () => {
        const user = userEvent.setup();

        // Start by logging in as admin
        renderApp({ initialPath: '/login' });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        });

        await user.type(screen.getByLabelText(/email/i), 'admin@viteplate.dev');
        await user.type(screen.getByLabelText(/password/i), 'admin123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        // Wait for admin dashboard to load
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
        });

        // Verify session is populated before logout
        expect(sessionStore.getState().accessToken).not.toBeNull();
        expect(sessionStore.getState().user?.name).toBe('Alice Admin');

        // Click the sign out button in the AuthNavbar
        await user.click(screen.getByRole('button', { name: /sign out/i }));

        // Should redirect to login page
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        });

        // Session should be fully cleared
        expect(sessionStore.getState().accessToken).toBeNull();
        expect(sessionStore.getState().user).toBeNull();
    });
});
