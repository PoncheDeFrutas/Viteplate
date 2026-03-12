export interface ApiMeta {
    message?: string;
    requestId?: string;
    timestamp?: string;
}

export interface ApiResponse<T> {
    data: T;
    meta?: ApiMeta;
}

export interface PaginationMeta {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface ActionResponse {
    success: boolean;
    message?: string;
}
