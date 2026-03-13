import { useSession } from '@entities/session';
import { Card, Container } from '@shared/ui';

export function DashboardPage() {
    const user = useSession((s) => s.user);

    return (
        <Container maxWidth="2xl" className="space-y-6">
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            {user ? (
                <Card>
                    <h2 className="mb-4 text-lg font-medium text-foreground">Profile</h2>
                    <dl className="space-y-3 text-sm">
                        <div className="flex gap-2">
                            <dt className="font-medium text-muted-foreground">Name:</dt>
                            <dd className="text-foreground">{user.name}</dd>
                        </div>
                        <div className="flex gap-2">
                            <dt className="font-medium text-muted-foreground">Email:</dt>
                            <dd className="text-foreground">{user.email}</dd>
                        </div>
                        <div className="flex gap-2">
                            <dt className="font-medium text-muted-foreground">Role:</dt>
                            <dd className="text-foreground">{user.role}</dd>
                        </div>
                    </dl>
                </Card>
            ) : (
                <p className="text-sm text-muted-foreground">No user information available.</p>
            )}
        </Container>
    );
}
