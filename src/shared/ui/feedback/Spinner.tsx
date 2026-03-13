import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const spinnerVariants = cva(
    'animate-spin rounded-full border-2 border-current border-t-transparent',
    {
        variants: {
            size: {
                sm: 'h-4 w-4',
                md: 'h-6 w-6',
                lg: 'h-8 w-8',
            },
        },
        defaultVariants: {
            size: 'md',
        },
    },
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface SpinnerProps
    extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof spinnerVariants> {
    /** Accessible label for screen readers. Defaults to "Loading". */
    label?: string;
}

/**
 * Animated loading spinner with accessible label.
 */
export function Spinner({ className, size, label = 'Loading', ...props }: SpinnerProps) {
    return (
        <div
            role="status"
            aria-label={label}
            className={cn(spinnerVariants({ size }), 'text-muted-foreground', className)}
            {...props}
        >
            <span className="sr-only">{label}</span>
        </div>
    );
}
