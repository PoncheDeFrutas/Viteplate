import { cn } from '@shared/lib/cn';
import type { HTMLAttributes, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface AffixProps extends HTMLAttributes<HTMLDivElement> {
    /** Offset from the top of the viewport in pixels (default `0`). */
    offsetTop?: number;
    /** Content to render. */
    children: ReactNode;
}

/**
 * Affix / Sticky wrapper that pins its content when scrolled past.
 * Uses CSS `position: sticky` for performance.
 */
export function Affix({ className, offsetTop = 0, children, style, ...props }: AffixProps) {
    return (
        <div
            className={cn('sticky z-40', className)}
            style={{ top: offsetTop, ...style }}
            {...props}
        >
            {children}
        </div>
    );
}
