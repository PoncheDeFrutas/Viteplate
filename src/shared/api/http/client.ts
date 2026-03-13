/**
 * Pre-configured Axios HTTP client for all API communication.
 *
 * Interceptor chain (applied in order):
 *
 *   **Request**
 *   1. `requestAuthInterceptor` — attaches `Authorization: Bearer <token>`
 *      to every outgoing request via the session adapter.
 *
 *   **Response**
 *   1. Success pass-through — responses with 2xx status are returned as-is.
 *   2. `createResponseAuthInterceptor` — intercepts 401 errors, triggers a
 *      single-flight token refresh (up to 2 retries), queues concurrent
 *      requests during refresh, and replays them on success. On exhausted
 *      retries it forces a logout.
 *
 * All other errors flow through to `normalizeApiError()` at the call site.
 */
import { API_CONFIG } from '@shared/config';
import axios from 'axios';
import { requestAuthInterceptor } from './interceptors/request-auth';
import { createResponseAuthInterceptor } from './interceptors/response-auth';

export const httpClient = axios.create({
    baseURL: API_CONFIG.baseUrl,
    timeout: API_CONFIG.timeoutMs,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

httpClient.interceptors.request.use(requestAuthInterceptor);

httpClient.interceptors.response.use(
    (response) => response,
    createResponseAuthInterceptor(httpClient),
);
