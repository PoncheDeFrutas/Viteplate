import { API_CONFIG, AUTH_ENDPOINTS } from '@shared/config';
import { AxiosHeaders } from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { normalizeApiError } from '../error/normalize-api-error';
import { handleUnauthorized } from '../refresh-controller';
import { getSessionAdapter } from '../session-adapter';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

function isRefreshRequest(config: InternalAxiosRequestConfig | undefined): boolean {
    return config?.url?.includes(AUTH_ENDPOINTS.refresh) ?? false;
}

export function createResponseAuthInterceptor(
    httpClient: AxiosInstance,
): (error: AxiosError) => Promise<AxiosResponse> {
    return async (error: AxiosError): Promise<AxiosResponse> => {
        if (!axios.isAxiosError(error)) {
            return Promise.reject(error);
        }

        const originalConfig = error.config as RetryableRequestConfig | undefined;

        if (!originalConfig || isRefreshRequest(originalConfig)) {
            return Promise.reject(normalizeApiError(error));
        }

        if (error.response?.status !== 401 || originalConfig._retry) {
            return Promise.reject(normalizeApiError(error));
        }

        try {
            const newToken = await handleUnauthorized(() => {
                const refreshToken = getSessionAdapter().getRefreshToken();

                return axios
                    .post<{
                        accessToken: string;
                        refreshToken: string;
                    }>(`${API_CONFIG.baseUrl}${AUTH_ENDPOINTS.refresh}`, { refreshToken })
                    .then((res) => res.data);
            });

            originalConfig._retry = true;
            originalConfig.headers = originalConfig.headers ?? new AxiosHeaders();
            originalConfig.headers.Authorization = `Bearer ${newToken}`;
            return httpClient(originalConfig);
        } catch (refreshError: unknown) {
            if (axios.isAxiosError(refreshError)) {
                return Promise.reject(normalizeApiError(refreshError));
            }
            return Promise.reject(refreshError);
        }
    };
}
