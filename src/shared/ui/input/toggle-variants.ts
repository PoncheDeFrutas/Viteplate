import { cva } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Toggle variants (shared between Toggle and ToggleGroup)
// ---------------------------------------------------------------------------

export const toggleVariants = cva(
    [
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors',
        'hover:bg-muted hover:text-muted-foreground',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
    ],
    {
        variants: {
            variant: {
                default: 'bg-transparent',
                outline:
                    'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
            },
            size: {
                sm: 'h-9 px-2.5',
                md: 'h-10 px-3',
                lg: 'h-11 px-5',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    },
);
