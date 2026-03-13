import { motion } from 'motion/react';
import { Settings, Shield, Inbox } from 'lucide-react';
import { Card, Container } from '@shared/ui';
import { EmptyState } from '@shared/ui/feedback';

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

export function AdminSettingsPage() {
    return (
        <Container maxWidth="2xl" className="space-y-6">
            <motion.h1 {...FADE_UP} className="text-2xl font-semibold text-foreground">
                Settings
            </motion.h1>

            <motion.div {...FADE_UP} transition={{ ...FADE_UP.transition, delay: 0.1 }}>
                <Card>
                    <div className="mb-4 flex items-center gap-2">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <h2 className="text-lg font-medium text-foreground">General</h2>
                    </div>
                    <EmptyState
                        icon={<Inbox className="h-5 w-5" />}
                        title="No settings yet"
                        description="Application settings will be available here. This page is restricted to administrators."
                    />
                </Card>
            </motion.div>

            <motion.div {...FADE_UP} transition={{ ...FADE_UP.transition, delay: 0.2 }}>
                <Card>
                    <div className="mb-4 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <h2 className="text-lg font-medium text-foreground">Security</h2>
                    </div>
                    <EmptyState
                        icon={<Inbox className="h-5 w-5" />}
                        title="Coming soon"
                        description="Security and access control configuration will appear in this section."
                    />
                </Card>
            </motion.div>
        </Container>
    );
}
