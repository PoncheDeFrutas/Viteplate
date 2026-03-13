import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
    /** Orientation of the separator line. Defaults to "horizontal". */
    orientation?: 'horizontal' | 'vertical';
    /** Use a subtle/decorative style. */
    decorative?: boolean;
}

/**
 * Visual divider between content sections.
 */
export function Separator({
    className,
    orientation = 'horizontal',
    decorative = true,
    ...props
}: SeparatorProps) {
    return (
        <div
            role={decorative ? 'none' : 'separator'}
            aria-orientation={decorative ? undefined : orientation}
            className={cn(
                'shrink-0 bg-border',
                orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
                className,
            )}
            {...props}
        />
    );
}
