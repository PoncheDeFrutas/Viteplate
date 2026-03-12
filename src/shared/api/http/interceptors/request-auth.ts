import { AxiosHeaders } from 'axios';
import { getSessionAdapter } from '../session-adapter';
import type { InternalHttpRequestConfig } from '../http-config';

export function requestAuthInterceptor(
    config: InternalHttpRequestConfig,
): InternalHttpRequestConfig {
    if (config.skipAuth) {
        return config;
    }

    const token = getSessionAdapter().getAccessToken();

    if (token) {
        config.headers = config.headers ?? new AxiosHeaders();
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}
