import { useSession } from '@entities/session';

export function DashboardPage() {
    const user = useSession((s) => s.user);

    return (
        <div className="w-full max-w-2xl space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Dashboard</h1>
            {user ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                        Profile
                    </h2>
                    <dl className="space-y-3 text-sm">
                        <div className="flex gap-2">
                            <dt className="font-medium text-gray-500 dark:text-gray-400">Name:</dt>
                            <dd className="text-gray-800 dark:text-gray-100">{user.name}</dd>
                        </div>
                        <div className="flex gap-2">
                            <dt className="font-medium text-gray-500 dark:text-gray-400">Email:</dt>
                            <dd className="text-gray-800 dark:text-gray-100">{user.email}</dd>
                        </div>
                        <div className="flex gap-2">
                            <dt className="font-medium text-gray-500 dark:text-gray-400">Role:</dt>
                            <dd className="text-gray-800 dark:text-gray-100">{user.role}</dd>
                        </div>
                    </dl>
                </div>
            ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No user information available.
                </p>
            )}
        </div>
    );
}
