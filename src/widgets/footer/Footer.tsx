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

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-border bg-background">
            <Separator />
            <div className="public-frame grid gap-5 py-8 sm:grid-cols-2 sm:items-end">
                <nav className="flex flex-wrap items-center gap-4">
                    {FOOTER_LINKS.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="eyebrow-label text-[10px] text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="text-left sm:text-right">
                    <p className="text-sm font-medium text-foreground">Viteplate</p>
                    <p className="text-xs text-muted-foreground">
                        {year} // React 19 + TypeScript starter for scalable frontend templates.
                    </p>
                </div>
            </div>
        </footer>
    );
}
