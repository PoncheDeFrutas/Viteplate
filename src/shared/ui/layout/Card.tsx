import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const cardVariants = cva('rounded-lg border border-border text-card-foreground', {
    variants: {
        variant: {
            default: 'bg-transparent',
            filled: 'bg-card',
        },
        padding: {
            none: '',
            sm: 'p-4',
            md: 'p-6',
        },
    },
    defaultVariants: {
        variant: 'default',
        padding: 'md',
    },
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

/**
 * Minimal bordered card with default (transparent) and filled variants.
 */
export function Card({ className, variant, padding, children, ...props }: CardProps) {
    return (
        <div className={cn(cardVariants({ variant, padding }), className)} {...props}>
            {children}
        </div>
    );
}
