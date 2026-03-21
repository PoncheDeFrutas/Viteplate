import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const badgeVariants = cva(
    'inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium',
    {
        variants: {
            variant: {
                default: 'border-primary bg-primary text-primary-foreground',
                secondary: 'border-border bg-secondary text-secondary-foreground',
                outline: 'border border-border text-foreground',
                destructive: 'border-destructive bg-destructive text-destructive-foreground',
                success: 'border-success bg-success text-success-foreground',
                warning: 'border-warning bg-warning text-warning-foreground',
                info: 'border-info bg-info text-info-foreground',
                muted: 'border-border bg-muted text-muted-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

/**
 * Small label for status, categories, or metadata.
 */
export function Badge({ className, variant, children, ...props }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant }), className)} {...props}>
            {children}
        </span>
    );
}
