import { Outlet } from '@tanstack/react-router';
import { PublicNavbar } from '@widgets/navbar';
import { Footer } from '@widgets/footer';

export function PublicLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <PublicNavbar />
            <main className="flex-1 p-6">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
