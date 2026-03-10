import { server } from './msw/server';
import '@testing-library/jest-dom/vitest';
import { beforeAll, afterAll, afterEach } from 'vitest';

// Establish API mocking before all tests.
beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
});

// Reset any request handlers that are declared as a part of our tests
afterEach(() => {
    server.resetHandlers();
});

// Clean up after the tests are finished.
afterAll(() => {
    server.close();
});
