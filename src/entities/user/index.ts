// Model
export { ROLES, roleSchema } from './model/types';
export { userSchema } from './model/schema';

export type { Role } from './model/types';
export type { User } from './model/schema';

// API — DTOs, mappers, endpoints, queries
export {
    userMeResponseDtoSchema,
    updateUserMeRequestDtoSchema,
    updateUserMeResponseDtoSchema,
    mapUserMeResponseToUser,
    mapUpdateUserToRequest,
    getUserMe,
    updateUserMe,
    userQueryKeys,
    currentUserQueryOptions,
    useCurrentUser,
    useUpdateCurrentUser,
} from './api';

export type { UserMeResponseDto, UpdateUserMeRequestDto, UpdateUserMeResponseDto } from './api';
