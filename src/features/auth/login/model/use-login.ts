import { useMutation } from '@tanstack/react-query';
import { sessionStore } from '@entities/session';
import { mapUserMeResponseToUser } from '@entities/user';
import { useNavigate } from '@tanstack/react-router';
import { ROUTE_PATHS } from '@shared/config';
import { login } from '../api';
import type { LoginRequestDto } from '../api';

/**
 * Mutation hook that handles the full login flow:
 *
 *   1. POST credentials to `/auth/login`.
 *   2. Store the access token in the Zustand session store.
 *   3. Map the user DTO to the domain model and set it in the store.
 *   4. Navigate to the dashboard.
 *
 * On failure, the error is available via the standard mutation state.
 */
export function useLogin() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (credentials: LoginRequestDto) => login(credentials),
        onSuccess: ({ accessToken, user: userDto }) => {
            sessionStore.getState().setAccessToken(accessToken);
            sessionStore.getState().setUser(mapUserMeResponseToUser(userDto));

            void navigate({ to: ROUTE_PATHS.dashboard });
        },
    });
}
