import { cva } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

export const linkVariants = cva(
    'inline-flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
    {
        variants: {
            variant: {
                default: 'text-primary underline',
                muted: 'text-muted-foreground underline',
                nav: 'text-foreground',
            },
            size: {
                sm: 'text-xs',
                md: 'text-sm',
                lg: 'text-base',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    },
);
