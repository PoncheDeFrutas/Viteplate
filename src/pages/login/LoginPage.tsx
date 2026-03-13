import { LoginForm } from '@features/auth/login';

export function LoginPage() {
    return (
        <div className="flex min-h-full flex-col items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-foreground">Sign in</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter your credentials to access the dashboard.
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
