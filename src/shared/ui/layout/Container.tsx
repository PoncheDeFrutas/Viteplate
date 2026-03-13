import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const containerVariants = cva('mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10', {
    variants: {
        maxWidth: {
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-xl',
            '2xl': 'max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl',
        },
    },
    defaultVariants: {
        maxWidth: 'sm',
    },
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ContainerProps
    extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {}

/**
 * Width-constrained content container with configurable max-width.
 */
export function Container({ className, maxWidth, children, ...props }: ContainerProps) {
    return (
        <div className={cn(containerVariants({ maxWidth }), className)} {...props}>
            {children}
        </div>
    );
}
