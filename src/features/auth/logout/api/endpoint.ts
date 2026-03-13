import { z } from 'zod';
import { apiPost } from '@shared/api';
import { AUTH_ENDPOINTS } from '@shared/config';

// ---------------------------------------------------------------------------
// Response schema
// ---------------------------------------------------------------------------

/**
 * The logout endpoint returns a simple success acknowledgement.
 * Some backends return `{ success: true }`, others return `204 No Content`.
 * We accept a minimal object; the response body is not used further.
 */
const logoutResponseSchema = z.object({
    success: z.boolean(),
});

// ---------------------------------------------------------------------------
// POST /auth/logout
// ---------------------------------------------------------------------------

/**
 * Sends a logout request to the backend.
 * Uses `withCredentials: true` so the browser includes the httpOnly
 * refresh-token cookie, allowing the backend to invalidate it.
 */
export async function logout(): Promise<void> {
    await apiPost(AUTH_ENDPOINTS.logout, undefined, {
        schema: logoutResponseSchema,
        config: {
            withCredentials: true,
        },
    });
}
