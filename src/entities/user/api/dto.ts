import { z } from 'zod';
import { roleSchema } from '../model/types';

// ---------------------------------------------------------------------------
// GET /users/me — response
// ---------------------------------------------------------------------------

/**
 * Raw shape returned by the backend for the current user endpoint.
 * Fields use snake_case to match typical REST API conventions.
 * The mapper layer converts this to the domain `User` type.
 */
export const userMeResponseDtoSchema = z.object({
    id: z.string().min(1),
    email: z.email(),
    name: z.string().min(1),
    role: roleSchema,
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export type UserMeResponseDto = z.infer<typeof userMeResponseDtoSchema>;

// ---------------------------------------------------------------------------
// PATCH /users/me — request
// ---------------------------------------------------------------------------

/**
 * Payload sent to the backend when updating the current user's profile.
 * All fields are optional — only changed fields are sent.
 */
export const updateUserMeRequestDtoSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
});

export type UpdateUserMeRequestDto = z.infer<typeof updateUserMeRequestDtoSchema>;

// ---------------------------------------------------------------------------
// PATCH /users/me — response
// ---------------------------------------------------------------------------

/**
 * The backend returns the full updated user after a PATCH.
 * Same shape as the GET response.
 */
export const updateUserMeResponseDtoSchema = userMeResponseDtoSchema;

export type UpdateUserMeResponseDto = z.infer<typeof updateUserMeResponseDtoSchema>;
