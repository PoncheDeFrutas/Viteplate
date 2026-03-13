import type { User } from '../model/schema';
import type { UpdateUserMeRequestDto, UserMeResponseDto } from './dto';

// ---------------------------------------------------------------------------
// Backend → Frontend (DTO → Domain)
// ---------------------------------------------------------------------------

/**
 * Maps the raw backend response for `/users/me` to the domain `User` type.
 * Strips transport-only fields (`created_at`, `updated_at`) that the
 * frontend domain model does not need.
 */
export function mapUserMeResponseToUser(dto: UserMeResponseDto): User {
    return {
        id: dto.id,
        email: dto.email,
        name: dto.name,
        role: dto.role,
    };
}

// ---------------------------------------------------------------------------
// Frontend → Backend (Domain → DTO)
// ---------------------------------------------------------------------------

/**
 * Builds the request payload for `PATCH /users/me` from a partial
 * domain object. Only includes fields that are explicitly provided.
 */
export function mapUpdateUserToRequest(
    data: Partial<Pick<User, 'name' | 'email'>>,
): UpdateUserMeRequestDto {
    const dto: UpdateUserMeRequestDto = {};

    if (data.name !== undefined) {
        dto.name = data.name;
    }

    if (data.email !== undefined) {
        dto.email = data.email;
    }

    return dto;
}
