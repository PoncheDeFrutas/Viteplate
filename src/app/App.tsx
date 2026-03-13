import { QueryProvider } from './providers/query';

export function App() {
    return (
        <QueryProvider>
            <main className="flex min-h-screen items-center justify-center">
                <h1 className="text-2xl font-semibold text-gray-800">Viteplate</h1>
            </main>
        </QueryProvider>
    );
}
