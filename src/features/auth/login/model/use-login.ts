import { useMutation } from '@tanstack/react-query';
import { sessionStore } from '@entities/session';
import { mapUserMeResponseToUser } from '@entities/user';
import { login } from '../api';
import type { LoginRequestDto } from '../api';

/**
 * Mutation hook that handles the full login flow:
 *
 *   1. POST credentials to `/auth/login`.
 *   2. Store the access token in the Zustand session store.
 *   3. Map the user DTO to the domain model and set it in the store.
 *   4. Navigate to the role-specific home page (admin -> `/admin`,
 *      viewer -> `/overview`, default -> `/dashboard`).
 *
 * On failure, the error is available via the standard mutation state.
 */
export function useLogin() {
    return useMutation({
        mutationFn: (credentials: LoginRequestDto) => login(credentials),
        onSuccess: ({ accessToken, user: userDto }) => {
            sessionStore.getState().setAccessToken(accessToken);

            const user = mapUserMeResponseToUser(userDto);
            sessionStore.getState().setUser(user);
        },
    });
}
