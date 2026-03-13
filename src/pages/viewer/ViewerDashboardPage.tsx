import { motion } from 'motion/react';
import { Eye, User } from 'lucide-react';
import { useSession } from '@entities/session';
import { Card, Container } from '@shared/ui';
import { Avatar } from '@shared/ui/display';

// ---------------------------------------------------------------------------
// Animation presets
// ---------------------------------------------------------------------------

const FADE_UP = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ViewerDashboardPage() {
    const user = useSession((s) => s.user);

    return (
        <Container maxWidth="2xl" className="space-y-6">
            <motion.h1 {...FADE_UP} className="text-2xl font-semibold text-foreground">
                Overview
            </motion.h1>

            <motion.div {...FADE_UP} transition={{ ...FADE_UP.transition, delay: 0.1 }}>
                <Card>
                    <div className="flex items-start gap-3">
                        <Eye className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            Welcome to your read-only overview. You can browse information but
                            cannot make changes.
                        </p>
                    </div>
                </Card>
            </motion.div>

            {user && (
                <motion.div {...FADE_UP} transition={{ ...FADE_UP.transition, delay: 0.2 }}>
                    <Card>
                        <div className="mb-4 flex items-center gap-3">
                            <Avatar name={user.name} size="md" />
                            <h2 className="text-lg font-medium text-foreground">Your profile</h2>
                        </div>
                        <dl className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                <dt className="font-medium text-muted-foreground">Name:</dt>
                                <dd className="text-foreground">{user.name}</dd>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                <dt className="font-medium text-muted-foreground">Email:</dt>
                                <dd className="text-foreground">{user.email}</dd>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                <dt className="font-medium text-muted-foreground">Role:</dt>
                                <dd className="text-foreground">{user.role}</dd>
                            </div>
                        </dl>
                    </Card>
                </motion.div>
            )}
        </Container>
    );
}
