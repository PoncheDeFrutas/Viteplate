import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { ReactNode, PropsWithChildren } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const tagVariants = cva('inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs', {
    variants: {
        variant: {
            default: 'border-primary bg-primary text-primary-foreground',
            secondary: 'border-border bg-secondary text-secondary-foreground',
            outline: 'border border-border text-foreground',
            destructive: 'border-destructive bg-destructive text-destructive-foreground',
            success: 'border-success bg-success text-success-foreground',
            warning: 'border-warning bg-warning text-warning-foreground',
            info: 'border-info bg-info text-info-foreground',
        },
        size: {
            sm: 'h-5 text-[0.65rem]',
            md: 'h-6',
            lg: 'h-7 text-sm',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
    },
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface TagProps extends VariantProps<typeof tagVariants> {
    /** Content inside the tag. */
    children: ReactNode;
    /** Additional class names. */
    className?: string;
    /** Callback when the remove button is clicked. If omitted the remove button is hidden. */
    onRemove?: () => void;
    /** Disable the remove button. */
    disabled?: boolean;
}

/**
 * Compact label tag with optional animated removal.
 * Wrap a list of Tags in `<TagGroup>` (AnimatePresence) for exit animations.
 */
export function Tag({ className, variant, size, onRemove, disabled, children }: TagProps) {
    return (
        <span className={cn(tagVariants({ variant, size }), className)}>
            {children}
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    disabled={disabled}
                    className="ml-0.5 p-0.5 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none"
                    aria-label="Remove"
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </span>
    );
}

export function TagGroup({ children }: PropsWithChildren) {
    return <>{children}</>;
}
