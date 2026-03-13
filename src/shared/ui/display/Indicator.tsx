import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const indicatorVariants = cva('inline-block shrink-0 rounded-full', {
    variants: {
        variant: {
            default: 'bg-primary',
            success: 'bg-success',
            warning: 'bg-warning',
            destructive: 'bg-destructive',
            info: 'bg-info',
            muted: 'bg-muted-foreground',
        },
        size: {
            sm: 'h-1.5 w-1.5',
            md: 'h-2 w-2',
            lg: 'h-2.5 w-2.5',
        },
        pulse: {
            true: 'animate-pulse',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
        pulse: false,
    },
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface IndicatorProps
    extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof indicatorVariants> {}

/**
 * Small coloured dot for signalling status (online, active, error, etc.).
 */
export function Indicator({ className, variant, size, pulse, ...props }: IndicatorProps) {
    return (
        <span
            role="status"
            className={cn(indicatorVariants({ variant, size, pulse }), className)}
            {...props}
        />
    );
}
