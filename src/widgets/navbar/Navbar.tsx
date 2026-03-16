import { Link, useMatchRoute } from '@tanstack/react-router';
import { LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '@app/providers/theme';
import { useLogout } from '@features/auth/logout';
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

function NavLink({ item }: { item: NavItem }) {
    const matchRoute = useMatchRoute();
    const isActive = matchRoute({ to: item.to, fuzzy: true });

    return (
        <Link
            to={item.to}
            className={cn(
                'eyebrow-label relative text-[10px] text-muted-foreground transition-colors hover:text-foreground',
                'after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform after:duration-200',
                isActive && 'text-foreground after:scale-x-100',
                !isActive && 'hover:after:scale-x-100',
            )}
        >
            {item.label}
        </Link>
    );
}

function BrandMark() {
    return (
        <Link to="/" className="inline-flex items-center gap-4">
            <span className="eyebrow-label rounded-sm border border-foreground px-2 py-1 text-[9px] text-foreground">
                VP
            </span>
            <span className="leading-tight">
                <span className="eyebrow-label block text-[9px] text-muted-foreground">
                    Scalable Starter
                </span>
                <span className="block text-base font-semibold text-foreground">Viteplate</span>
            </span>
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
            <DropdownMenuContent align="end" className="w-56">
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

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
    );
}

export function PublicNavbar() {
    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
            <div className="public-frame flex h-16 items-center justify-between gap-6">
                <BrandMark />

                <nav className="hidden items-center gap-6 md:flex">
                    {PUBLIC_NAV_ITEMS.map((item) => (
                        <NavLink key={item.to} item={item} />
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <div className="md:hidden">
                        <MobileNavMenu items={PUBLIC_NAV_ITEMS} />
                    </div>
                </div>
            </div>
        </header>
    );
}

export function AuthNavbar() {
    const { items, userName } = useNavItems();
    const logoutMutation = useLogout();

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
            <div className="public-frame flex h-16 items-center justify-between gap-6">
                <div className="flex items-center gap-8">
                    <BrandMark />
                    <nav className="hidden items-center gap-6 md:flex">
                        {items.map((item) => (
                            <NavLink key={item.to} item={item} />
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    {userName && (
                        <span className="hidden rounded-sm border border-border px-2 py-1 text-xs text-muted-foreground lg:inline">
                            {userName}
                        </span>
                    )}
                    <ThemeToggle />
                    <Button
                        variant="outline"
                        size="sm"
                        className="hidden md:inline-flex"
                        onClick={() => logoutMutation.mutate()}
                        loading={logoutMutation.isPending}
                    >
                        {logoutMutation.isPending ? (
                            'Signing out…'
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
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Open navigation menu"
                                >
                                    <Menu className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
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
                                    {logoutMutation.isPending ? 'Signing out…' : 'Sign out'}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}
