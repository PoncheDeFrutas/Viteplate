import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

type DataListProps = ComponentPropsWithoutRef<'dl'>;

/**
 * Definition-list layout for label/value pairs (e.g. profile fields, metadata).
 */
export function DataList({ className, ...props }: DataListProps) {
    return (
        <dl
            className={cn('grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm', className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

interface DataListItemProps {
    /** Label shown on the left. */
    label: ReactNode;
    /** Value shown on the right. */
    children: ReactNode;
    /** Additional class names on the wrapping fragment container. */
    className?: string;
}

export function DataListItem({ label, children, className }: DataListItemProps) {
    return (
        <div className={cn('col-span-2 grid grid-cols-subgrid items-baseline', className)}>
            <dt className="font-medium text-muted-foreground">{label}</dt>
            <dd className="text-foreground">{children}</dd>
        </div>
    );
}
