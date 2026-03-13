import { Link, useMatchRoute } from '@tanstack/react-router';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useLogout } from '@features/auth/logout';
import { useTheme } from '@app/providers/theme';
import { Button } from '@shared/ui';
import { cn } from '@shared/lib/cn';
import { PUBLIC_NAV_ITEMS } from './nav-config';
import { useNavItems } from './use-nav-items';
import type { NavItem } from './nav-config';

// ---------------------------------------------------------------------------
// Shared nav link with hover underline animation
// ---------------------------------------------------------------------------

function NavLink({ item }: { item: NavItem }) {
    const matchRoute = useMatchRoute();
    const isActive = matchRoute({ to: item.to, fuzzy: true });

    return (
        <Link
            to={item.to}
            className={cn(
                'relative text-sm font-medium transition-colors hover:text-foreground',
                'after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform after:duration-200',
                'hover:after:scale-x-100',
                isActive ? 'text-foreground after:scale-x-100' : 'text-muted-foreground',
            )}
        >
            {item.label}
        </Link>
    );
}

// ---------------------------------------------------------------------------
// Public navbar (unauthenticated)
// ---------------------------------------------------------------------------

export function PublicNavbar() {
    return (
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <span className="text-lg font-semibold text-foreground">Viteplate</span>
            <nav className="flex items-center gap-6">
                {PUBLIC_NAV_ITEMS.map((item) => (
                    <NavLink key={item.to} item={item} />
                ))}
            </nav>
        </header>
    );
}

// ---------------------------------------------------------------------------
// Authenticated navbar (role-aware)
// ---------------------------------------------------------------------------

export function AuthNavbar() {
    const { items, userName } = useNavItems();
    const logoutMutation = useLogout();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-8">
                <span className="text-lg font-semibold text-foreground">Viteplate</span>
                <nav className="flex items-center gap-6">
                    {items.map((item) => (
                        <NavLink key={item.to} item={item} />
                    ))}
                </nav>
            </div>
            <div className="flex items-center gap-3">
                {userName && <span className="text-sm text-muted-foreground">{userName}</span>}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => logoutMutation.mutate()}
                    loading={logoutMutation.isPending}
                >
                    {logoutMutation.isPending ? (
                        'Signing out...'
                    ) : (
                        <>
                            <LogOut className="h-4 w-4" />
                            Sign out
                        </>
                    )}
                </Button>
            </div>
        </header>
    );
}
