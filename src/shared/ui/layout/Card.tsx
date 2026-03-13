import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const cardVariants = cva(
    [
        'rounded-lg border border-border text-card-foreground',
        'transition-[box-shadow,border-color,transform] duration-200 ease-out',
    ],
    {
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
            interactive: {
                true: 'hover:-translate-y-0.5 hover:border-muted-foreground/30 hover:shadow-md',
            },
        },
        defaultVariants: {
            variant: 'default',
            padding: 'md',
            interactive: false,
        },
    },
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

/**
 * Minimal bordered card with default (transparent) and filled variants.
 * Set `interactive` for hover lift/shadow micro-interaction.
 */
export function Card({ className, variant, padding, interactive, children, ...props }: CardProps) {
    return (
        <div className={cn(cardVariants({ variant, padding, interactive }), className)} {...props}>
            {children}
        </div>
    );
}
