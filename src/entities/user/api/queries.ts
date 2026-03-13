import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { User } from '../model/schema';
import type { UpdateUserMeRequestDto } from './dto';
import { getUserMe, updateUserMe } from './endpoints';
import { mapUpdateUserToRequest } from './mappers';

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const userQueryKeys = {
    all: ['user'] as const,
    me: () => [...userQueryKeys.all, 'me'] as const,
};

// ---------------------------------------------------------------------------
// Query options (reusable outside hooks — e.g., in loaders or prefetch)
// ---------------------------------------------------------------------------

export function currentUserQueryOptions() {
    return queryOptions({
        queryKey: userQueryKeys.me(),
        queryFn: getUserMe,
    });
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/**
 * Fetches the current authenticated user's profile.
 * Should only be enabled when the user is authenticated (pass `enabled`).
 *
 * @example
 * ```tsx
 * const { data: user } = useCurrentUser({ enabled: isAuthenticated });
 * ```
 */
export function useCurrentUser(options?: { enabled?: boolean }) {
    return useQuery({
        ...currentUserQueryOptions(),
        enabled: options?.enabled ?? true,
    });
}

/**
 * Mutation to update the current user's profile.
 * Accepts a partial domain object and handles the DTO mapping internally.
 * Invalidates the current-user query on success.
 *
 * @example
 * ```tsx
 * const { mutate } = useUpdateCurrentUser();
 * mutate({ name: 'New Name' });
 * ```
 */
export function useUpdateCurrentUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<Pick<User, 'name' | 'email'>>) => {
            const dto: UpdateUserMeRequestDto = mapUpdateUserToRequest(data);
            return updateUserMe(dto);
        },
        onSuccess: (updatedUser) => {
            // Optimistically update the cache with the server response
            queryClient.setQueryData(userQueryKeys.me(), updatedUser);
        },
    });
}
