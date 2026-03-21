import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { InputHTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const inputVariants = cva(
    [
        'flex h-9 w-full border border-input bg-transparent px-2 text-sm',
        'file:border-0 file:bg-transparent file:text-sm',
        'placeholder:text-muted-foreground',
        'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
        'disabled:opacity-50',
    ],
    {
        variants: {
            variant: {
                default: '',
                error: 'border-destructive focus-visible:ring-destructive',
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
 * Minimal text input with default and error variants.
 */
export function Input({ className, variant, ...props }: InputProps) {
    return <input className={cn(inputVariants({ variant }), className)} {...props} />;
}
