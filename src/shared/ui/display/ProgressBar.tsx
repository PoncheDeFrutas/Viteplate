import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const trackVariants = cva('w-full overflow-hidden bg-muted', {
    variants: {
        size: {
            sm: 'h-1',
            md: 'h-2',
            lg: 'h-3',
        },
    },
    defaultVariants: {
        size: 'md',
    },
});

const fillVariants = cva('h-full', {
    variants: {
        variant: {
            default: 'bg-primary',
            success: 'bg-success',
            warning: 'bg-warning',
            destructive: 'bg-destructive',
            info: 'bg-info',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ProgressBarProps
    extends
        Omit<HTMLAttributes<HTMLDivElement>, 'role'>,
        VariantProps<typeof trackVariants>,
        VariantProps<typeof fillVariants> {
    /** Current progress value (0–100). Clamped internally. */
    value: number;
    /** Optional label shown above the bar. */
    label?: string;
    /** Show the numeric percentage next to the label. */
    showValue?: boolean;
}

/**
 * Horizontal progress indicator with configurable size and colour variant.
 */
export function ProgressBar({
    className,
    value,
    size,
    variant,
    label,
    showValue,
    ...props
}: ProgressBarProps) {
    const clamped = Math.min(100, Math.max(0, value));

    return (
        <div className={cn('space-y-1.5', className)} {...props}>
            {(label || showValue) && (
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                    {label && <span>{label}</span>}
                    {showValue && <span>{Math.round(clamped)}%</span>}
                </div>
            )}
            <div
                className={trackVariants({ size })}
                role="progressbar"
                aria-valuenow={clamped}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div className={fillVariants({ variant })} style={{ width: `${clamped}%` }} />
            </div>
        </div>
    );
}
