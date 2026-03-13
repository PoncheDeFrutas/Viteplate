import { Link } from '@tanstack/react-router';
import { ROUTE_PATHS } from '@shared/config';

export function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <h1 className="text-3xl font-bold text-foreground">Unauthorized</h1>
            <p className="mt-2 text-muted-foreground">You do not have access to this page.</p>
            <Link
                to={ROUTE_PATHS.home}
                className="mt-4 text-primary hover:underline hover:text-primary-hover"
            >
                Go home
            </Link>
        </div>
    );
}
