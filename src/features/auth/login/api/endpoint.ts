import { apiPost } from '@shared/api';
import { AUTH_ENDPOINTS } from '@shared/config';
import { loginResponseDtoSchema } from './dto';
import type { LoginRequestDto, LoginResponseDto } from './dto';

// ---------------------------------------------------------------------------
// POST /auth/login
// ---------------------------------------------------------------------------

/**
 * Authenticates the user with email and password.
 * Returns the access/refresh tokens and user profile.
 *
 * The request uses `skipAuth: true` because the user is not yet
 * authenticated, and `withCredentials: true` so the browser accepts
 * the httpOnly refresh-token cookie set by the backend.
 */
export async function login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
    return apiPost(AUTH_ENDPOINTS.login, credentials, {
        schema: loginResponseDtoSchema,
        config: {
            skipAuth: true,
            withCredentials: true,
        },
    });
}
