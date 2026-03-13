import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { ButtonHTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const buttonVariants = cva(
    [
        'inline-flex items-center justify-center rounded-md text-sm font-medium',
        'focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
    ],
    {
        variants: {
            variant: {
                primary: ['bg-primary text-primary-foreground shadow-sm', 'hover:bg-primary-hover'],
                ghost: ['text-muted-foreground', 'hover:bg-accent hover:text-accent-foreground'],
            },
            size: {
                sm: 'px-2 py-1',
                md: 'px-3 py-1.5',
                lg: 'px-4 py-2',
            },
            fullWidth: {
                true: 'w-full',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
            fullWidth: false,
        },
    },
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    /** Shows a loading state (disables the button). */
    loading?: boolean;
}

/**
 * Button primitive with primary and ghost variants.
 */
export function Button({
    className,
    variant,
    size,
    fullWidth,
    loading,
    disabled,
    children,
    type = 'button',
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={cn(buttonVariants({ variant, size, fullWidth }), className)}
            {...props}
        >
            {children}
        </button>
    );
}
