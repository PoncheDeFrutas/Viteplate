import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const avatarVariants = cva(
    'inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground select-none',
    {
        variants: {
            size: {
                sm: 'h-8 w-8 text-xs',
                md: 'h-10 w-10 text-sm',
                lg: 'h-12 w-12 text-base',
            },
        },
        defaultVariants: {
            size: 'md',
        },
    },
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extracts up to two initials from a name string. */
function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0]![0]?.toUpperCase() ?? '?';
    return `${parts[0]![0]?.toUpperCase() ?? ''}${parts[parts.length - 1]![0]?.toUpperCase() ?? ''}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface AvatarProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof avatarVariants> {
    /** Full name — used to derive initials. */
    name: string;
}

/**
 * Circular avatar that displays user initials.
 */
export function Avatar({ className, size, name, ...props }: AvatarProps) {
    return (
        <span
            className={cn(avatarVariants({ size }), className)}
            aria-label={name}
            title={name}
            {...props}
        >
            {getInitials(name)}
        </span>
    );
}
