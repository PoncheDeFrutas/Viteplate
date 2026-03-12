import type { AxiosRequestConfig } from 'axios';
import type { ZodSchema } from 'zod';
import { parseWithSchema } from '@shared/lib/parse-with-schema';
import { httpClient } from './client';

interface ApiRequestOptions<T> {
    config?: AxiosRequestConfig;
    schema: ZodSchema<T>;
}

interface ApiGetOptions<T> extends ApiRequestOptions<T> {
    params?: Record<string, unknown>;
}

function parseResponse<T>(schema: ZodSchema<T>, data: unknown): T {
    return parseWithSchema(schema, data);
}

export async function apiGet<T>(url: string, options: ApiGetOptions<T>): Promise<T> {
    const res = await httpClient.get<unknown>(url, {
        ...options.config,
        params: options.params,
    });

    return parseResponse(options.schema, res.data);
}

export async function apiPost<T, B = unknown>(
    url: string,
    body: B | undefined,
    options: ApiRequestOptions<T>,
): Promise<T> {
    const res = await httpClient.post<unknown>(url, body, options.config);
    return parseResponse(options.schema, res.data);
}

export async function apiPut<T, B = unknown>(
    url: string,
    body: B,
    options: ApiRequestOptions<T>,
): Promise<T> {
    const res = await httpClient.put<unknown>(url, body, options.config);
    return parseResponse(options.schema, res.data);
}

export async function apiPatch<T, B = unknown>(
    url: string,
    body: B,
    options: ApiRequestOptions<T>,
): Promise<T> {
    const res = await httpClient.patch<unknown>(url, body, options.config);
    return parseResponse(options.schema, res.data);
}

export async function apiDelete<T>(url: string, options: ApiRequestOptions<T>): Promise<T> {
    const res = await httpClient.delete<unknown>(url, options.config);
    return parseResponse(options.schema, res.data);
}
