import { AUTH_ENDPOINTS } from '@shared/config';
import { parseWithSchema } from '@shared/lib/parse-with-schema';
import { AxiosHeaders } from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import { z } from 'zod';
import { normalizeApiError, createUnknownApiError } from '../error/normalize-api-error';
import type { HttpRequestConfig, InternalHttpRequestConfig } from '../http-config';
import { handleUnauthorized } from '../refresh-controller';
import { clearSession, getSessionAdapter } from '../session-adapter';

const refreshTokenResponseSchema = z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
});

function isRefreshRequest(config: InternalHttpRequestConfig | undefined): boolean {
    return config?.url?.includes(AUTH_ENDPOINTS.refresh) ?? false;
}

export function createResponseAuthInterceptor(
    httpClient: AxiosInstance,
): (error: AxiosError) => Promise<AxiosResponse> {
    return async (error: AxiosError): Promise<AxiosResponse> => {
        if (!axios.isAxiosError(error)) {
            return Promise.reject(createUnknownApiError(error));
        }

        const originalConfig = error.config as InternalHttpRequestConfig | undefined;

        if (!originalConfig || isRefreshRequest(originalConfig)) {
            return Promise.reject(normalizeApiError(error));
        }

        if (error.response?.status !== 401 || originalConfig._retry) {
            return Promise.reject(normalizeApiError(error));
        }

        // With httpOnly cookies, getRefreshToken() returns a sentinel
        // ("httponly") when the user has an active session, or null when
        // they don't. It never returns the actual refresh token.
        const canRefresh = getSessionAdapter().getRefreshToken();

        if (!canRefresh) {
            clearSession('missing_refresh_token');
            return Promise.reject(normalizeApiError(error));
        }

        try {
            const newToken = await handleUnauthorized(() => {
                const refreshConfig: HttpRequestConfig = {
                    skipAuth: true,
                    withCredentials: true,
                };

                // The refresh token is sent automatically by the browser
                // as an httpOnly cookie. No token in the request body.
                return httpClient
                    .post<unknown>(AUTH_ENDPOINTS.refresh, undefined, refreshConfig)
                    .then((res) => parseWithSchema(refreshTokenResponseSchema, res.data));
            });

            originalConfig._retry = true;
            originalConfig.headers = originalConfig.headers ?? new AxiosHeaders();
            originalConfig.headers.Authorization = `Bearer ${newToken}`;
            return httpClient(originalConfig);
        } catch (refreshError: unknown) {
            if (axios.isAxiosError(refreshError)) {
                return Promise.reject(normalizeApiError(refreshError));
            }
            return Promise.reject(createUnknownApiError(refreshError));
        }
    };
}
