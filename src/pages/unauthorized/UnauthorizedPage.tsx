import { Link } from '@tanstack/react-router';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { ROUTE_PATHS } from '@shared/config';
import { Button } from '@shared/ui';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded border border-border text-muted-foreground">
                    <ShieldAlert className="h-7 w-7" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Unauthorized</h1>
                <p className="text-muted-foreground">You do not have access to this page.</p>
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
