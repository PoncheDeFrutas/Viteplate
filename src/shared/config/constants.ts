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
    login: '/auth/login',
    logout: '/auth/logout',
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
    about: '/about',
    stack: '/stack',
    login: '/login',
    dashboard: '/dashboard',
    admin: '/admin',
    adminSettings: '/admin/settings',
    overview: '/overview',
    unauthorized: '/unauthorized',
    designSystem: '/design-system',
} as const;

/**
 * Returns the default home path for a given role.
 * Used by guards and redirects to send users to their role-specific page.
 */
export function getRoleHomePath(role: string | null): string {
    switch (role) {
        case 'admin':
            return ROUTE_PATHS.admin;
        case 'viewer':
            return ROUTE_PATHS.overview;
        default:
            return ROUTE_PATHS.dashboard;
    }
}
