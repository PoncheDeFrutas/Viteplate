import { Link, useMatchRoute } from '@tanstack/react-router';
import { Sun, Moon, LogOut, Menu } from 'lucide-react';
import { useLogout } from '@features/auth/logout';
import { useTheme } from '@app/providers/theme';
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@shared/ui';
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

function MobileNavMenu({ items }: { items: NavItem[] }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                    <Menu className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
                {items.map((item) => (
                    <DropdownMenuItem key={item.to} asChild>
                        <Link to={item.to} className="w-full">
                            {item.label}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// ---------------------------------------------------------------------------
// Public navbar (unauthenticated)
// ---------------------------------------------------------------------------

export function PublicNavbar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
            <span className="text-lg font-semibold text-foreground">Viteplate</span>
            <div className="flex items-center gap-2 sm:gap-3">
                <nav className="hidden items-center gap-6 md:flex">
                    {PUBLIC_NAV_ITEMS.map((item) => (
                        <NavLink key={item.to} item={item} />
                    ))}
                </nav>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
                <div className="md:hidden">
                    <MobileNavMenu items={PUBLIC_NAV_ITEMS} />
                </div>
            </div>
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
        <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
            <div className="flex items-center gap-8">
                <span className="text-lg font-semibold text-foreground">Viteplate</span>
                <nav className="hidden items-center gap-6 md:flex">
                    {items.map((item) => (
                        <NavLink key={item.to} item={item} />
                    ))}
                </nav>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
                {userName && (
                    <span className="hidden text-sm text-muted-foreground lg:inline">
                        {userName}
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:inline-flex"
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
                <div className="md:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                                <Menu className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                            {items.map((item) => (
                                <DropdownMenuItem key={item.to} asChild>
                                    <Link to={item.to} className="w-full">
                                        {item.label}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onSelect={() => {
                                    logoutMutation.mutate();
                                }}
                                disabled={logoutMutation.isPending}
                            >
                                <LogOut className="h-4 w-4" />
                                {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
