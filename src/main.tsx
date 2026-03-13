import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@app/App';
import '@app/styles/index.css';

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
