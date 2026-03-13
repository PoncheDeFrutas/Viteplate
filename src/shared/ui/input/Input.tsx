import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { InputHTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const inputVariants = cva(
    [
        'block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground',
        'placeholder-muted-foreground shadow-sm',
        'focus:ring-1 focus:ring-ring focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
    ],
    {
        variants: {
            variant: {
                default: ['focus:border-ring'],
                error: ['border-destructive', 'focus:border-destructive focus:ring-destructive'],
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

interface InputProps
    extends
        Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
        VariantProps<typeof inputVariants> {}

/**
 * Styled text input with default and error variants.
 */
export function Input({ className, variant, ...props }: InputProps) {
    return <input className={cn(inputVariants({ variant }), className)} {...props} />;
}
