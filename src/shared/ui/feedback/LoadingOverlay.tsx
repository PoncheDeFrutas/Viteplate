import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@shared/lib/cn';
import { Spinner } from './Spinner';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface LoadingOverlayProps {
    /** Whether the overlay is visible. */
    visible: boolean;
    /** Custom spinner or loading content. */
    children?: ReactNode;
    /** Additional class names for the overlay backdrop. */
    className?: string;
    /** Overlay z-index (default `50`). */
    zIndex?: number;
}

/**
 * Full-area translucent loading overlay with fade animation.
 * Place inside a `position: relative` container.
 */
export function LoadingOverlay({ visible, children, className, zIndex = 50 }: LoadingOverlayProps) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ zIndex }}
                    className={cn(
                        'absolute inset-0 flex items-center justify-center rounded-[inherit] bg-background/80 backdrop-blur-[1px]',
                        className,
                    )}
                >
                    {children ?? <Spinner size="md" />}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
