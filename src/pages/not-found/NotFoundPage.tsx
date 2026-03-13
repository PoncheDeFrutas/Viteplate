import { Link } from '@tanstack/react-router';
import { ROUTE_PATHS } from '@shared/config';

export function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
            <h1 className="text-4xl font-bold text-gray-800">404</h1>
            <p className="mt-2 text-gray-500">Page not found.</p>
            <Link to={ROUTE_PATHS.home} className="mt-4 text-blue-600 hover:underline">
                Go home
            </Link>
        </div>
    );
}
