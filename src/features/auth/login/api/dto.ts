import { z } from 'zod';
import { userMeResponseDtoSchema } from '@entities/user';

// ---------------------------------------------------------------------------
// POST /auth/login — request
// ---------------------------------------------------------------------------

/**
 * Payload sent to the login endpoint.
 * The backend expects `email` + `password` in the request body.
 */
export const loginRequestDtoSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

export type LoginRequestDto = z.infer<typeof loginRequestDtoSchema>;

// ---------------------------------------------------------------------------
// POST /auth/login — response
// ---------------------------------------------------------------------------

/**
 * Response from the login endpoint.
 * Contains auth tokens and the authenticated user's profile.
 * The `refreshToken` is also set as an httpOnly cookie by the backend;
 * the frontend stores only the `accessToken` in memory.
 */
export const loginResponseDtoSchema = z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
    user: userMeResponseDtoSchema,
});

export type LoginResponseDto = z.infer<typeof loginResponseDtoSchema>;
