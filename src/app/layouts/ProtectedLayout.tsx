import { Outlet } from '@tanstack/react-router';
import { useSession } from '@entities/session';
import { useLogout } from '@features/auth/logout';
import { Button } from '@shared/ui';
import { useTheme } from '../providers/theme';

export function ProtectedLayout() {
    const user = useSession((s) => s.user);
    const logoutMutation = useLogout();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="flex items-center justify-between border-b border-border px-6 py-4">
                <span className="text-lg font-semibold text-foreground">Viteplate</span>
                <div className="flex items-center gap-4">
                    {user && <span className="text-sm text-muted-foreground">{user.name}</span>}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleTheme}
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? 'Dark' : 'Light'}
                    </Button>
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={() => logoutMutation.mutate()}
                        loading={logoutMutation.isPending}
                    >
                        {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
                    </Button>
                </div>
            </header>
            <main className="flex flex-1 items-center justify-center p-6">
                <Outlet />
            </main>
        </div>
    );
}
