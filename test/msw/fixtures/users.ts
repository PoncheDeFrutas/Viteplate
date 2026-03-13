import type { UserMeResponseDto } from '@entities/user';

// ---------------------------------------------------------------------------
// Mock credentials (email → password)
// ---------------------------------------------------------------------------

export const MOCK_CREDENTIALS: Record<string, string> = {
    'admin@viteplate.dev': 'admin123',
    'user@viteplate.dev': 'user123',
    'viewer@viteplate.dev': 'viewer123',
};

// ---------------------------------------------------------------------------
// Mock user DTOs (snake_case, matches backend response shape)
// ---------------------------------------------------------------------------

const now = new Date().toISOString();

export const MOCK_ADMIN_USER: UserMeResponseDto = {
    id: '1',
    email: 'admin@viteplate.dev',
    name: 'Alice Admin',
    role: 'admin',
    created_at: now,
    updated_at: now,
};

export const MOCK_REGULAR_USER: UserMeResponseDto = {
    id: '2',
    email: 'user@viteplate.dev',
    name: 'Bob User',
    role: 'user',
    created_at: now,
    updated_at: now,
};

export const MOCK_VIEWER_USER: UserMeResponseDto = {
    id: '3',
    email: 'viewer@viteplate.dev',
    name: 'Carol Viewer',
    role: 'viewer',
    created_at: now,
    updated_at: now,
};

// ---------------------------------------------------------------------------
// Lookup by email
// ---------------------------------------------------------------------------

const USERS_BY_EMAIL: Record<string, UserMeResponseDto> = {
    [MOCK_ADMIN_USER.email]: MOCK_ADMIN_USER,
    [MOCK_REGULAR_USER.email]: MOCK_REGULAR_USER,
    [MOCK_VIEWER_USER.email]: MOCK_VIEWER_USER,
};

export function findUserByEmail(email: string): UserMeResponseDto | undefined {
    return USERS_BY_EMAIL[email];
}

// ---------------------------------------------------------------------------
// Mock tokens
// ---------------------------------------------------------------------------

let tokenCounter = 0;

export function generateMockAccessToken(userId: string): string {
    tokenCounter++;
    return `mock-access-token-${userId}-${tokenCounter}`;
}

export function generateMockRefreshToken(userId: string): string {
    tokenCounter++;
    return `mock-refresh-token-${userId}-${tokenCounter}`;
}
