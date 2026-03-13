import { Link } from '@tanstack/react-router';
import { ROUTE_PATHS } from '@shared/config';

export function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800">Unauthorized</h1>
            <p className="mt-2 text-gray-500">You do not have access to this page.</p>
            <Link to={ROUTE_PATHS.home} className="mt-4 text-blue-600 hover:underline">
                Go home
            </Link>
        </div>
    );
}
