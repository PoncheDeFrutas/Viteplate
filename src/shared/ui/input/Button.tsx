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
        'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium',
        'transition-[transform,box-shadow] duration-150 ease-out',
        'hover:shadow-sm active:scale-[0.98]',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
    ],
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
                outline:
                    'border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
                ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
                destructive:
                    'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
                link: 'text-foreground underline-offset-4 hover:underline',
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
