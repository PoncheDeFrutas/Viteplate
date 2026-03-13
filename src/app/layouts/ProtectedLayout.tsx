import { Outlet } from '@tanstack/react-router';

export function ProtectedLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <header className="border-b border-gray-200 px-6 py-4">
                <span className="text-lg font-semibold text-gray-800">Viteplate</span>
            </header>
            <main className="flex flex-1 items-center justify-center p-6">
                <Outlet />
            </main>
        </div>
    );
}
