import { env } from './env';

export const API_CONFIG = {
    baseUrl: env.apiBaseUrl,
    timeoutMs: 10_000,
} as const;

export const MSW_CONFIG = {
    enabled: env.enableMsw,
} as const;

export const DEBUG_CONFIG = {
    enabled: env.enableDebug,
} as const;

export const AUTH_ENDPOINTS = {
    refresh: '/auth/refresh',
} as const;

export const USER_ENDPOINTS = {
    me: '/users/me',
} as const;

export const STORAGE_KEYS = {
    session: 'viteplate.session',
    theme: 'viteplate.theme',
} as const;

export const ROUTE_PATHS = {
    home: '/',
    login: '/login',
    dashboard: '/dashboard',
    unauthorized: '/unauthorized',
} as const;
