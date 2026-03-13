import { cva } from 'class-variance-authority';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const tagVariants = cva(
    'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-primary/10 text-primary',
                secondary: 'bg-secondary text-secondary-foreground',
                outline: 'border border-border text-foreground',
                destructive: 'bg-destructive/10 text-destructive',
                success: 'bg-success/10 text-success',
                warning: 'bg-warning/10 text-warning',
                info: 'bg-info/10 text-info',
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
    },
);

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
        <motion.span
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={cn(tagVariants({ variant, size }), className)}
        >
            {children}
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    disabled={disabled}
                    className="ml-0.5 rounded-sm opacity-60 transition-opacity hover:opacity-100 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none"
                    aria-label="Remove"
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </motion.span>
    );
}

/**
 * Re-export of `AnimatePresence` from Motion for convenience.
 * Wrap a list of `<Tag>` elements in `<TagGroup>` to animate mount/unmount.
 */
export { AnimatePresence as TagGroup } from 'motion/react';
