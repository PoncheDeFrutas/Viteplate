import { Outlet } from '@tanstack/react-router';
import { AuthNavbar } from '@widgets/navbar';

export function ProtectedLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <AuthNavbar />
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}
