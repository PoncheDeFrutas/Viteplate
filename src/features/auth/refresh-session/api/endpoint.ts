import { z } from 'zod';
import { apiPost } from '@shared/api';
import { AUTH_ENDPOINTS } from '@shared/config';

// ---------------------------------------------------------------------------
// Response schema
// ---------------------------------------------------------------------------

const refreshSessionResponseSchema = z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
});

type RefreshSessionResponse = z.infer<typeof refreshSessionResponseSchema>;

// ---------------------------------------------------------------------------
// Endpoint
// ---------------------------------------------------------------------------

/**
 * Attempts to refresh the user's session by posting to `/auth/refresh`
 * with `withCredentials: true`. The browser sends the httpOnly refresh-token
 * cookie automatically; no explicit token is included in the request body.
 *
 * Returns the new access token (and the refresh token the backend echoes
 * back, though the frontend only stores the access token in memory).
 */
export async function refreshSession(): Promise<RefreshSessionResponse> {
    return apiPost(AUTH_ENDPOINTS.refresh, undefined, {
        schema: refreshSessionResponseSchema,
        config: {
            skipAuth: true,
            withCredentials: true,
        },
    });
}
