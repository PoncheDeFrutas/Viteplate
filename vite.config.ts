/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@app': new URL('./src/app', import.meta.url).pathname,
            '@pages': new URL('./src/pages', import.meta.url).pathname,
            '@widgets': new URL('./src/widgets', import.meta.url).pathname,
            '@features': new URL('./src/features', import.meta.url).pathname,
            '@entities': new URL('./src/entities', import.meta.url).pathname,
            '@shared': new URL('./src/shared', import.meta.url).pathname,
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        //setupFiles: './test/setupTests.ts',
    },
});
