import { Outlet } from '@tanstack/react-router';

export function PublicLayout() {
    return (
        <div className="app-shell flex min-h-screen flex-col bg-background">
            <a
                href="#main-content"
                className="sr-only z-60 rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
                Skip to content
            </a>
            <main id="main-content" className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}
