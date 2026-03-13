import { apiGet, apiPatch } from '@shared/api';
import { USER_ENDPOINTS } from '@shared/config';
import type { User } from '../model/schema';
import { userMeResponseDtoSchema, updateUserMeResponseDtoSchema } from './dto';
import type { UpdateUserMeRequestDto } from './dto';
import { mapUserMeResponseToUser } from './mappers';

// ---------------------------------------------------------------------------
// GET /users/me
// ---------------------------------------------------------------------------

/**
 * Fetches the current authenticated user's profile.
 * Validates the response against the DTO schema, then maps to domain `User`.
 */
export async function getUserMe(): Promise<User> {
    const dto = await apiGet(USER_ENDPOINTS.me, {
        schema: userMeResponseDtoSchema,
    });

    return mapUserMeResponseToUser(dto);
}

// ---------------------------------------------------------------------------
// PATCH /users/me
// ---------------------------------------------------------------------------

/**
 * Updates the current authenticated user's profile.
 * Accepts a pre-mapped DTO payload. Validates the response and maps
 * back to the domain `User`.
 */
export async function updateUserMe(data: UpdateUserMeRequestDto): Promise<User> {
    const dto = await apiPatch(USER_ENDPOINTS.me, data, {
        schema: updateUserMeResponseDtoSchema,
    });

    return mapUserMeResponseToUser(dto);
}
