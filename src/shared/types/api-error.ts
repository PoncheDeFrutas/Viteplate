export type ApiErrorCode =
    | 'UNAUTHORIZED'
    | 'TIMEOUT'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'NETWORK_ERROR'
    | 'RATE_LIMITED'
    | 'REQUEST_CANCELED'
    | 'CONFLICT'
    | 'VALIDATION_ERROR'
    | 'SERVER_ERROR'
    | 'UNKNOWN_ERROR';

export interface FieldError {
    field: string;
    message: string;
}

export interface ApiErrorDetails {
    reason?: string;
    fields?: FieldError[];
    meta?: Record<string, unknown>;
}

export interface ApiError {
    code: ApiErrorCode;
    message: string;
    status?: number;
    traceId?: string;
    timestamp?: string;
    path?: string;
    method?: string;
    isRetryable?: boolean;
    details?: ApiErrorDetails;
}
