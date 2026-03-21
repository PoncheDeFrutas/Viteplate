import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { TextareaHTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const textareaVariants = cva(
    [
        'flex min-h-[80px] w-full border border-input bg-transparent px-2 py-1 text-sm',
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
            resize: {
                none: 'resize-none',
                vertical: 'resize-y',
                horizontal: 'resize-x',
                both: 'resize',
            },
        },
        defaultVariants: {
            variant: 'default',
            resize: 'vertical',
        },
    },
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface TextareaProps
    extends
        Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
        VariantProps<typeof textareaVariants> {}

/**
 * Multi-line text input with default and error variants.
 * Resize behaviour is configurable via the `resize` prop.
 */
export function Textarea({ className, variant, resize, ...props }: TextareaProps) {
    return <textarea className={cn(textareaVariants({ variant, resize }), className)} {...props} />;
}
