import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import { Spinner } from '../feedback/Spinner';
import type { ButtonHTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const buttonVariants = cva(
    [
        'inline-flex items-center justify-center gap-2 border text-sm',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
    ],
    {
        variants: {
            variant: {
                default: 'border-primary bg-primary text-primary-foreground',
                secondary: 'border-border bg-secondary text-secondary-foreground',
                outline: 'border-input bg-transparent text-foreground',
                ghost: 'border-transparent bg-transparent text-foreground',
                destructive: 'border-destructive bg-destructive text-destructive-foreground',
                link: 'border-transparent bg-transparent text-foreground underline',
            },
            size: {
                sm: 'h-8 px-3 text-xs',
                md: 'h-9 px-4',
                lg: 'h-10 px-5',
                icon: 'h-9 w-9',
            },
            fullWidth: {
                true: 'w-full',
            },
        },
        defaultVariants: {
            variant: 'default',
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
    /** Shows a loading spinner and disables the button. */
    loading?: boolean;
}

/**
 * Multi-variant button primitive.
 *
 * Variants: `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`.
 * Sizes: `sm`, `md`, `lg`, `icon`.
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
            {loading && <Spinner size="xs" className="text-current" />}
            {children}
        </button>
    );
}
