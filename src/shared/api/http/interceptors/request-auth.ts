import { AxiosHeaders } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { getSessionAdapter } from '../session-adapter';

export function requestAuthInterceptor(
    config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
    const token = getSessionAdapter().getAccessToken();

    if (token) {
        config.headers = config.headers ?? new AxiosHeaders();
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}
