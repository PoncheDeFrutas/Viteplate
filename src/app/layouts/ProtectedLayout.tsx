import { Outlet } from '@tanstack/react-router';
import { useSession } from '@entities/session';
import { useLogout } from '@features/auth/logout';
import { useTheme } from '../providers/theme';

export function ProtectedLayout() {
    const user = useSession((s) => s.user);
    const logoutMutation = useLogout();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
            <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Viteplate
                </span>
                <div className="flex items-center gap-4">
                    {user && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {user.name}
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? 'Dark' : 'Light'}
                    </button>
                    <button
                        type="button"
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                        className="rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                        {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
                    </button>
                </div>
            </header>
            <main className="flex flex-1 items-center justify-center p-6">
                <Outlet />
            </main>
        </div>
    );
}
