import { motion } from 'motion/react';
import { cn } from '@shared/lib/cn';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TimelineItem {
    /** Title of the event. */
    title: string;
    /** Optional description text. */
    description?: string;
    /** Timestamp or date label. */
    date?: string;
    /** Optional custom icon for the dot. */
    icon?: ReactNode;
    /** Dot colour override. */
    dotClassName?: string;
}

interface TimelineProps {
    /** List of timeline events (top = most recent). */
    items: TimelineItem[];
    /** Additional class names for the root container. */
    className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Vertical timeline with staggered entrance animations.
 */
export function Timeline({ items, className }: TimelineProps) {
    return (
        <ol className={cn('relative space-y-6 border-l-2 border-border pl-6', className)}>
            {items.map((item, i) => (
                <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06, duration: 0.35, ease: 'easeOut' }}
                    className="relative"
                >
                    {/* Dot */}
                    <span
                        className={cn(
                            'absolute -left-[1.9rem] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-border bg-background',
                            item.dotClassName,
                        )}
                    >
                        {item.icon ?? <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </span>

                    {item.date && (
                        <time className="mb-1 block text-xs text-muted-foreground">
                            {item.date}
                        </time>
                    )}
                    <h4 className="text-sm font-medium leading-none">{item.title}</h4>
                    {item.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    )}
                </motion.li>
            ))}
        </ol>
    );
}
