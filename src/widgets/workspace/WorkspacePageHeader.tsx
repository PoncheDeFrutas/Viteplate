import { motion } from 'motion/react';
import { useMotionPresets } from '@shared/lib/motion';
import type { ReactNode } from 'react';

interface WorkspacePageHeaderProps {
    label: string;
    title: string;
    description: string;
    actions?: ReactNode;
}

export function WorkspacePageHeader({
    label,
    title,
    description,
    actions,
}: WorkspacePageHeaderProps) {
    const motionFx = useMotionPresets();

    return (
        <header className="workspace-grid items-end">
            <div className="col-span-12 space-y-3 lg:col-span-8">
                <motion.p {...motionFx.reveal()} className="workspace-label">
                    {label}
                </motion.p>
                <motion.h1
                    {...motionFx.reveal({ delay: 0.05 })}
                    className="public-heading max-w-5xl text-3xl font-semibold text-foreground sm:text-4xl xl:text-5xl"
                >
                    {title}
                </motion.h1>
                <motion.p
                    {...motionFx.reveal({ delay: 0.1 })}
                    className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base"
                >
                    {description}
                </motion.p>
            </div>
            {actions ? (
                <motion.div
                    {...motionFx.reveal({ delay: 0.12 })}
                    className="col-span-12 flex flex-wrap items-center gap-2 lg:col-span-4 lg:justify-end"
                >
                    {actions}
                </motion.div>
            ) : null}
        </header>
    );
}
