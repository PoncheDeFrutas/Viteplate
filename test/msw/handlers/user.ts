import { http, HttpResponse } from 'msw';
import { getMockSession } from './auth';

// ---------------------------------------------------------------------------
// GET /users/me
// ---------------------------------------------------------------------------

const getUserMeHandler = http.get('*/users/me', ({ request }) => {
    const session = getMockSession();

    if (!session) {
        return HttpResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    // Verify the access token matches (simulates Bearer token validation)
    const authHeader = request.headers.get('Authorization');
    const expectedHeader = `Bearer ${session.accessToken}`;

    if (authHeader !== expectedHeader) {
        return HttpResponse.json({ message: 'Invalid or expired token.' }, { status: 401 });
    }

    return HttpResponse.json(session.user);
});

export const userHandlers = [getUserMeHandler];
