import { motion } from 'motion/react';
import { Users, Activity, HeartPulse, User } from 'lucide-react';
import { useSession } from '@entities/session';
import { Card, Container } from '@shared/ui';
import { Avatar } from '@shared/ui/display';
import type { LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Animation presets
// ---------------------------------------------------------------------------

const FADE_UP = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
} as const;

function stagger(index: number) {
    return { ...FADE_UP, transition: { ...FADE_UP.transition, delay: 0.1 + index * 0.08 } };
}

// ---------------------------------------------------------------------------
// Stats data
// ---------------------------------------------------------------------------

interface Stat {
    label: string;
    value: string;
    icon: LucideIcon;
}

/** Placeholder stats — replace with real data when the API is available. */
const STATS: Stat[] = [
    { label: 'Total users', value: '\u2014', icon: Users },
    { label: 'Active sessions', value: '\u2014', icon: Activity },
    { label: 'System health', value: 'OK', icon: HeartPulse },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AdminDashboardPage() {
    const user = useSession((s) => s.user);

    return (
        <Container maxWidth="2xl" className="space-y-6">
            <motion.h1 {...FADE_UP} className="text-2xl font-semibold text-foreground">
                Admin Dashboard
            </motion.h1>

            <div className="grid gap-4 sm:grid-cols-3">
                {STATS.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div key={stat.label} {...stagger(i)}>
                            <Card interactive padding="sm" className="text-center">
                                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {user && (
                <motion.div {...FADE_UP} transition={{ ...FADE_UP.transition, delay: 0.35 }}>
                    <Card>
                        <div className="mb-4 flex items-center gap-3">
                            <Avatar name={user.name} size="md" />
                            <h2 className="text-lg font-medium text-foreground">Admin profile</h2>
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
