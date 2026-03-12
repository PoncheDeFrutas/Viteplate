import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';
import { parseWithSchema } from '@shared/lib/parse-with-schema';
import type { ApiError } from '@shared/types/api-error';
import { httpClient } from './client';
import { createSchemaValidationError, createUnknownApiError } from './error/normalize-api-error';
import type { HttpRequestConfig } from './http-config';

interface ApiRequestOptions<T> {
    config?: HttpRequestConfig;
    schema: ZodSchema<T>;
}

interface ApiGetOptions<T> extends ApiRequestOptions<T> {
    params?: Record<string, unknown>;
}

function parseResponse<T>(schema: ZodSchema<T>, data: unknown): T {
    return parseWithSchema(schema, data);
}

function normalizeThrown(error: unknown, url?: string, method?: string): ApiError {
    if (error instanceof ZodError) {
        return createSchemaValidationError(error, url, method);
    }

    // ApiError objects from the response interceptor pass through as-is.
    if (isApiError(error)) {
        return error;
    }

    return createUnknownApiError(error);
}

function isApiError(value: unknown): value is ApiError {
    return (
        typeof value === 'object' &&
        value !== null &&
        'code' in value &&
        'message' in value &&
        'isRetryable' in value &&
        'timestamp' in value
    );
}

export async function apiGet<T>(url: string, options: ApiGetOptions<T>): Promise<T> {
    try {
        const res = await httpClient.get<unknown>(url, {
            ...options.config,
            params: options.params,
        });

        return parseResponse(options.schema, res.data);
    } catch (error: unknown) {
        throw normalizeThrown(error, url, 'GET');
    }
}

export async function apiPost<T, B = unknown>(
    url: string,
    body: B | undefined,
    options: ApiRequestOptions<T>,
): Promise<T> {
    try {
        const res = await httpClient.post<unknown>(url, body, options.config);
        return parseResponse(options.schema, res.data);
    } catch (error: unknown) {
        throw normalizeThrown(error, url, 'POST');
    }
}

export async function apiPut<T, B = unknown>(
    url: string,
    body: B,
    options: ApiRequestOptions<T>,
): Promise<T> {
    try {
        const res = await httpClient.put<unknown>(url, body, options.config);
        return parseResponse(options.schema, res.data);
    } catch (error: unknown) {
        throw normalizeThrown(error, url, 'PUT');
    }
}

export async function apiPatch<T, B = unknown>(
    url: string,
    body: B,
    options: ApiRequestOptions<T>,
): Promise<T> {
    try {
        const res = await httpClient.patch<unknown>(url, body, options.config);
        return parseResponse(options.schema, res.data);
    } catch (error: unknown) {
        throw normalizeThrown(error, url, 'PATCH');
    }
}

export async function apiDelete<T>(url: string, options: ApiRequestOptions<T>): Promise<T> {
    try {
        const res = await httpClient.delete<unknown>(url, options.config);
        return parseResponse(options.schema, res.data);
    } catch (error: unknown) {
        throw normalizeThrown(error, url, 'DELETE');
    }
}
