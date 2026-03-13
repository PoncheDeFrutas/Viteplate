import { http, HttpResponse } from 'msw';
import type { UserMeResponseDto } from '@entities/user';
import {
    MOCK_CREDENTIALS,
    findUserByEmail,
    generateMockAccessToken,
    generateMockRefreshToken,
} from '../fixtures';

// ---------------------------------------------------------------------------
// In-memory server session state
// ---------------------------------------------------------------------------

/**
 * Simulates server-side session state. In the real backend this would be
 * stored in a database / Redis, and the refresh token would live in an
 * httpOnly cookie. Here we keep a simple in-memory reference so that
 * `/auth/refresh` and `/users/me` can resolve the current user.
 */
let currentSession: {
    user: UserMeResponseDto;
    accessToken: string;
    refreshToken: string;
} | null = null;

/** Allows tests to inspect or reset the mock session. */
export function getMockSession() {
    return currentSession;
}

export function clearMockSession() {
    currentSession = null;
}

// ---------------------------------------------------------------------------
// POST /auth/login
// ---------------------------------------------------------------------------

const loginHandler = http.post('*/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body.email || !body.password) {
        return HttpResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const expectedPassword = MOCK_CREDENTIALS[body.email];

    if (!expectedPassword || expectedPassword !== body.password) {
        return HttpResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    const user = findUserByEmail(body.email);

    if (!user) {
        return HttpResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    const accessToken = generateMockAccessToken(user.id);
    const refreshToken = generateMockRefreshToken(user.id);

    currentSession = { user, accessToken, refreshToken };

    return HttpResponse.json({ accessToken, refreshToken, user });
});

// ---------------------------------------------------------------------------
// POST /auth/logout
// ---------------------------------------------------------------------------

const logoutHandler = http.post('*/auth/logout', () => {
    currentSession = null;
    return HttpResponse.json({ success: true });
});

// ---------------------------------------------------------------------------
// POST /auth/refresh
// ---------------------------------------------------------------------------

const refreshHandler = http.post('*/auth/refresh', () => {
    if (!currentSession) {
        return HttpResponse.json({ message: 'No active session.' }, { status: 401 });
    }

    // Rotate tokens
    const accessToken = generateMockAccessToken(currentSession.user.id);
    const refreshToken = generateMockRefreshToken(currentSession.user.id);

    currentSession = { ...currentSession, accessToken, refreshToken };

    return HttpResponse.json({ accessToken, refreshToken });
});

export const authHandlers = [loginHandler, logoutHandler, refreshHandler];
