import { cva } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Toggle variants (shared between Toggle and ToggleGroup)
// ---------------------------------------------------------------------------

export const toggleVariants = cva(
    [
        'inline-flex items-center justify-center rounded border border-border bg-transparent text-sm',
        'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=on]:bg-muted data-[state=on]:text-foreground',
    ],
    {
        variants: {
            variant: {
                default: '',
                outline: 'border-input',
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
