import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';
import { LoginForm } from '@features/auth/login';
import { useMotionPresets } from '@shared/lib/motion';
import { Card } from '@shared/ui';

export function LoginPage() {
    const motionFx = useMotionPresets();

    return (
        <div className="public-shell py-10 sm:py-14">
            <div className="public-frame public-grid min-h-[68vh] items-center">
                <motion.section {...motionFx.reveal()} className="col-span-12 lg:col-span-6">
                    <p className="public-kicker">Authentication</p>
                    <h1 className="public-heading mt-3 max-w-xl text-4xl font-semibold text-foreground sm:text-5xl">
                        Access the protected workspace.
                    </h1>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                        Session state, role guards, and refresh behavior are centralized in the
                        platform architecture. Sign in to continue to your role-specific dashboard.
                    </p>
                </motion.section>

                <motion.section
                    {...motionFx.reveal({ delay: 0.06 })}
                    className="col-span-12 lg:col-span-5 lg:col-start-8"
                >
                    <Card variant="filled" padding="md" className="retro-panel rounded-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <span className="inline-flex rounded-sm border border-border p-2">
                                <LogIn className="h-4 w-4" />
                            </span>
                            <div>
                                <p className="public-kicker">Sign in</p>
                                <p className="text-sm text-muted-foreground">
                                    Use your platform credentials
                                </p>
                            </div>
                        </div>
                        <LoginForm />
                    </Card>
                </motion.section>
            </div>
        </div>
    );
}
