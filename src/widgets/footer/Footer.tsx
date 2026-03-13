import { Link } from '@tanstack/react-router';
import { ROUTE_PATHS } from '@shared/config';
import { Separator } from '@shared/ui';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const FOOTER_LINKS = [
    { label: 'Home', to: ROUTE_PATHS.home },
    { label: 'About', to: ROUTE_PATHS.about },
    { label: 'Stack', to: ROUTE_PATHS.stack },
    { label: 'Sign in', to: ROUTE_PATHS.login },
] as const;

/**
 * Minimal footer for public pages — links, copyright.
 */
export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto">
            <Separator />
            <div className="flex flex-col items-center gap-4 px-6 py-6 sm:flex-row sm:justify-between">
                <nav className="flex items-center gap-4">
                    {FOOTER_LINKS.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <p className="text-xs text-muted-foreground">
                    &copy; {year} Viteplate. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
