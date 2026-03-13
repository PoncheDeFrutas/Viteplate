import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';

/**
 * Bordered card container for grouped content sections.
 */
export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'rounded-lg border border-border bg-card p-6 text-card-foreground',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}
