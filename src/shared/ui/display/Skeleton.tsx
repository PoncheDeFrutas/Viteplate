import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    /** Render as a circle (e.g. avatar placeholder). */
    circle?: boolean;
}

/**
 * Animated placeholder used while content is loading.
 * Uses the `skeleton-shimmer` CSS animation defined in the global stylesheet.
 */
export function Skeleton({ className, circle, ...props }: SkeletonProps) {
    return (
        <div
            aria-hidden="true"
            className={cn('skeleton-shimmer rounded-md', circle && 'rounded-full', className)}
            {...props}
        />
    );
}
