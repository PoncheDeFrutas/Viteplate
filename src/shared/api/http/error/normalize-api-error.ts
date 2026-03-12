import type { AxiosError } from 'axios';
import type { ApiError, ApiErrorCode, FieldError } from '@shared/types/api-error';

interface BackendErrorBody {
    message?: string;
    code?: string;
    traceId?: string;
    reason?: string;
    fields?: FieldError[];
    meta?: Record<string, unknown>;
}

const STATUS_TO_CODE: Record<number, ApiErrorCode> = {
    400: 'VALIDATION_ERROR',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    408: 'TIMEOUT',
    422: 'VALIDATION_ERROR',
    429: 'RATE_LIMITED',
    500: 'SERVER_ERROR',
    502: 'SERVER_ERROR',
    503: 'SERVER_ERROR',
    504: 'TIMEOUT',
};

const RETRYABLE_CODES: ReadonlySet<ApiErrorCode> = new Set([
    'NETWORK_ERROR',
    'TIMEOUT',
    'RATE_LIMITED',
    'SERVER_ERROR',
]);

function isKnownCode(value: string): value is ApiErrorCode {
    const codes: ReadonlySet<string> = new Set<string>([
        'UNAUTHORIZED',
        'TIMEOUT',
        'FORBIDDEN',
        'NOT_FOUND',
        'NETWORK_ERROR',
        'RATE_LIMITED',
        'REQUEST_CANCELED',
        'CONFLICT',
        'VALIDATION_ERROR',
        'SERVER_ERROR',
        'UNKNOWN_ERROR',
    ]);
    return codes.has(value);
}

function defaultMessageForCode(code: ApiErrorCode): string {
    const messages: Record<ApiErrorCode, string> = {
        UNAUTHORIZED: 'Unauthorized access. Please log in.',
        FORBIDDEN: 'Access denied. You do not have permission to perform this action.',
        NOT_FOUND: 'The requested resource was not found.',
        NETWORK_ERROR: 'Network error. Please check your connection.',
        RATE_LIMITED: 'Too many requests. Please try again later.',
        REQUEST_CANCELED: 'The request was canceled.',
        TIMEOUT: 'The request timed out.',
        CONFLICT: 'A conflict occurred with the current state of the resource.',
        VALIDATION_ERROR: 'The provided data is invalid.',
        SERVER_ERROR: 'An internal server error occurred.',
        UNKNOWN_ERROR: 'An unexpected error occurred.',
    };
    return messages[code];
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseBackendBody(data: unknown): BackendErrorBody | null {
    if (!isRecord(data)) return null;

    return {
        message: typeof data.message === 'string' ? data.message : undefined,
        code: typeof data.code === 'string' ? data.code : undefined,
        traceId: typeof data.traceId === 'string' ? data.traceId : undefined,
        reason: typeof data.reason === 'string' ? data.reason : undefined,
        fields: Array.isArray(data.fields) ? extractFields(data.fields) : undefined,
        meta: isRecord(data.meta) ? (data.meta as Record<string, unknown>) : undefined,
    };
}

function extractFields(raw: unknown[]): FieldError[] | undefined {
    const fields: FieldError[] = [];

    for (const item of raw) {
        if (isRecord(item) && typeof item.field === 'string' && typeof item.message === 'string') {
            fields.push({ field: item.field, message: item.message });
        }
    }

    return fields.length > 0 ? fields : undefined;
}

function resolveCode(status: number | undefined, backendCode: string | undefined): ApiErrorCode {
    if (backendCode && isKnownCode(backendCode)) return backendCode;
    if (status !== undefined) return STATUS_TO_CODE[status] ?? 'UNKNOWN_ERROR';
    return 'UNKNOWN_ERROR';
}

export function normalizeApiError(error: AxiosError): ApiError {
    const { response, config, code: axiosCode } = error;

    if (!response) {
        if (axiosCode === 'ERR_CANCELED') {
            return {
                code: 'REQUEST_CANCELED',
                message: defaultMessageForCode('REQUEST_CANCELED'),
                path: config?.url,
                method: config?.method?.toUpperCase(),
                isRetryable: false,
                timestamp: new Date().toISOString(),
            };
        }

        const isTimeout = axiosCode === 'ECONNABORTED' || axiosCode === 'ETIMEDOUT';
        const code: ApiErrorCode = isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR';

        return {
            code,
            message: defaultMessageForCode(code),
            path: config?.url,
            method: config?.method?.toUpperCase(),
            isRetryable: true,
            timestamp: new Date().toISOString(),
        };
    }

    const status = response.status;
    const body = parseBackendBody(response.data);

    const code = resolveCode(status, body?.code);
    const message = body?.message ?? defaultMessageForCode(code);

    return {
        code,
        message,
        status,
        traceId: body?.traceId,
        path: config?.url,
        method: config?.method?.toUpperCase(),
        isRetryable: RETRYABLE_CODES.has(code),
        timestamp: new Date().toISOString(),
        details:
            body?.reason || body?.fields || body?.meta
                ? {
                      reason: body.reason,
                      fields: body.fields,
                      meta: body.meta,
                  }
                : undefined,
    };
}
