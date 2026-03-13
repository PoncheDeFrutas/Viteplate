import { cva } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

export const linkVariants = cva(
    'inline-flex items-center gap-1 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
    {
        variants: {
            variant: {
                default: 'text-primary underline-offset-4 hover:underline',
                muted: 'text-muted-foreground underline-offset-4 hover:text-foreground hover:underline',
                nav: 'text-foreground/60 hover:text-foreground',
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
