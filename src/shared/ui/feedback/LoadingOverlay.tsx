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
    if (!visible) {
        return null;
    }

    return (
        <div
            style={{ zIndex }}
            className={cn(
                'absolute inset-0 flex items-center justify-center bg-background/70',
                className,
            )}
        >
            {children ?? <Spinner size="md" />}
        </div>
    );
}
