export { httpClient } from './http/client';
export {
    createSchemaValidationError,
    createUnknownApiError,
    normalizeApiError,
} from './http/error/normalize-api-error';
export { apiDelete, apiGet, apiPatch, apiPost, apiPut } from './http/http-methods';
export { resetRefreshState } from './http/refresh-controller';
export { clearSession, resetSessionAdapter, setSessionAdapter } from './http/session-adapter';

export type { RefreshFn } from './http/refresh-controller';
export type { HttpRequestConfig } from './http/http-config';
export type { SessionAdapter, SessionCleanupReason } from './http/session-adapter';
export type { ApiError, ApiErrorCode, ApiErrorDetails, FieldError } from '@shared/types/api-error';
