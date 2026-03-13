import { server } from './msw/server';
import '@testing-library/jest-dom/vitest';
import { beforeAll, afterAll, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// jsdom polyfills
// ---------------------------------------------------------------------------

// jsdom does not implement window.matchMedia.
// Provide a minimal stub so ThemeProvider and other code that reads the
// OS color-scheme preference can work in tests.
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
    }),
});

// ---------------------------------------------------------------------------
// MSW lifecycle
// ---------------------------------------------------------------------------

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
