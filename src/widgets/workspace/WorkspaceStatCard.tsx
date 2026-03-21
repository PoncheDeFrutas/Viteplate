import { motion } from 'motion/react';
import { useMotionPresets } from '@shared/lib/motion';
import { Card } from '@shared/ui';
import type { LucideIcon } from 'lucide-react';

interface WorkspaceStatCardProps {
    index: number;
    label: string;
    value: string;
    detail: string;
    icon: LucideIcon;
}

export function WorkspaceStatCard({
    index,
    label,
    value,
    detail,
    icon: Icon,
}: WorkspaceStatCardProps) {
    const motionFx = useMotionPresets();

    return (
        <motion.div {...motionFx.sequence(index, 0.06, 0.05)}>
            <Card className="workspace-panel p-3">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <p className="workspace-label">{label}</p>
                    <span className="inline-flex border border-border p-2">
                        <Icon className="h-4 w-4" />
                    </span>
                </div>
                <p className="text-2xl font-semibold tracking-tight">{value}</p>
                <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
            </Card>
        </motion.div>
    );
}
