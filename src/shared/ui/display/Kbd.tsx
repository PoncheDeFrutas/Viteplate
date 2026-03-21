import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface KbdProps extends HTMLAttributes<HTMLElement> {
    /** The keyboard key(s) to display. */
    children: React.ReactNode;
}

/**
 * Renders an inline keyboard shortcut badge.
 *
 * Styled as a small bordered box that resembles a physical key cap.
 */
export function Kbd({ className, children, ...props }: KbdProps) {
    return (
        <kbd
            className={cn(
                'inline-flex h-5 items-center justify-center border border-border bg-muted px-1.5',
                'font-mono text-[11px] font-medium text-muted-foreground',
                'select-none',
                className,
            )}
            {...props}
        >
            {children}
        </kbd>
    );
}
