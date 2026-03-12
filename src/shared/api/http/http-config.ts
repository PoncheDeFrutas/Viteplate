import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

export interface HttpRequestConfig extends AxiosRequestConfig {
    skipAuth?: boolean;
}

export interface InternalHttpRequestConfig extends InternalAxiosRequestConfig {
    skipAuth?: boolean;
    _retry?: boolean;
}
