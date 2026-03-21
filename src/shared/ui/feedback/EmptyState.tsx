import { cn } from '@shared/lib/cn';
import type { HTMLAttributes, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
    /** Lucide icon or any React node rendered above the title. */
    icon?: ReactNode;
    /** Primary message. */
    title: string;
    /** Optional secondary description. */
    description?: string;
    /** Optional action slot (e.g. a Button). */
    action?: ReactNode;
}

/**
 * Illustrated empty state placeholder for sections with no content yet.
 */
export function EmptyState({
    className,
    icon,
    title,
    description,
    action,
    ...props
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-3 py-12 text-center',
                className,
            )}
            {...props}
        >
            {icon && (
                <div className="flex h-10 w-10 items-center justify-center rounded border border-border text-muted-foreground">
                    {icon}
                </div>
            )}
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {description && <p className="max-w-xs text-sm text-muted-foreground">{description}</p>}
            {action && <div className="pt-2">{action}</div>}
        </div>
    );
}
