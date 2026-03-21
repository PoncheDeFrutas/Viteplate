import { Link } from '@tanstack/react-router';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { ROUTE_PATHS } from '@shared/config';
import { Button } from '@shared/ui';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded border border-border text-muted-foreground">
                    <FileQuestion className="h-7 w-7" />
                </div>
                <h1 className="text-4xl font-bold text-foreground">404</h1>
                <p className="text-muted-foreground">Page not found.</p>
                <Link to={ROUTE_PATHS.home}>
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4" />
                        Go home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
