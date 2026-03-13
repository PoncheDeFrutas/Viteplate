import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { setSessionAdapter } from '@shared/api';
import { createSessionAdapter } from '@entities/session';
import { App } from '@app/App';
import '@app/styles/index.css';

// Plug the Zustand-backed session adapter into the HTTP client
// interceptors before the app renders. This ensures every request
// has access to the in-memory access token from the session store.
setSessionAdapter(createSessionAdapter());

async function enableMocking(): Promise<void> {
    if (!import.meta.env.DEV) {
        return;
    }

    const { MSW_CONFIG } = await import('@shared/config');

    if (!MSW_CONFIG.enabled) {
        return;
    }

    const { worker } = await import('../test/msw/browser');
    await worker.start({ onUnhandledRequest: 'warn' });
}

enableMocking().then(() => {
    const root = document.getElementById('root');

    if (!root) {
        throw new Error('Root element not found. Ensure index.html contains <div id="root">.');
    }

    createRoot(root).render(
        <StrictMode>
            <App />
        </StrictMode>,
    );
});
