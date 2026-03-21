import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const cardVariants = cva(['border border-border bg-card text-card-foreground'], {
    variants: {
        variant: {
            default: '',
            filled: 'bg-card',
        },
        padding: {
            none: '',
            sm: 'p-4',
            md: 'p-6',
        },
        interactive: {
            true: 'focus-within:ring-1 focus-within:ring-ring',
        },
    },
    defaultVariants: {
        variant: 'default',
        padding: 'md',
        interactive: false,
    },
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

/**
 * Minimal bordered card with default and filled variants.
 */
export function Card({ className, variant, padding, interactive, children, ...props }: CardProps) {
    return (
        <div className={cn(cardVariants({ variant, padding, interactive }), className)} {...props}>
            {children}
        </div>
    );
}
