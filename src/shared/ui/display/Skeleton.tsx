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
 * Minimal placeholder used while content is loading.
 */
export function Skeleton({ className, circle, ...props }: SkeletonProps) {
    return (
        <div
            aria-hidden="true"
            className={cn('rounded bg-muted', circle && 'rounded-full', className)}
            {...props}
        />
    );
}
