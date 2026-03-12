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
