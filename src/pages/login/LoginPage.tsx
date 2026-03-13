import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';
import { LoginForm } from '@features/auth/login';
import { Card } from '@shared/ui';

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

const FADE_UP = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LoginPage() {
    return (
        <div className="relative flex min-h-full flex-col items-center justify-center px-4">
            {/* Subtle dot-grid background */}
            <div
                aria-hidden="true"
                className="dot-grid pointer-events-none absolute inset-0 opacity-30"
            />

            <motion.div {...FADE_UP} className="relative w-full max-w-sm space-y-8">
                {/* Branding area */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground">
                        <LogIn className="h-5 w-5" />
                    </div>
                    <h1 className="text-2xl font-semibold text-foreground">Sign in</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your credentials to access the dashboard.
                    </p>
                </div>

                {/* Form in card */}
                <Card variant="filled" padding="md">
                    <LoginForm />
                </Card>
            </motion.div>
        </div>
    );
}
