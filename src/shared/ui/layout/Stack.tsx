import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const stackVariants = cva('flex', {
    variants: {
        direction: {
            row: 'flex-row',
            column: 'flex-col',
            'row-reverse': 'flex-row-reverse',
            'column-reverse': 'flex-col-reverse',
        },
        gap: {
            none: 'gap-0',
            xs: 'gap-1',
            sm: 'gap-2',
            md: 'gap-4',
            lg: 'gap-6',
            xl: 'gap-8',
        },
        align: {
            start: 'items-start',
            center: 'items-center',
            end: 'items-end',
            stretch: 'items-stretch',
            baseline: 'items-baseline',
        },
        justify: {
            start: 'justify-start',
            center: 'justify-center',
            end: 'justify-end',
            between: 'justify-between',
            around: 'justify-around',
            evenly: 'justify-evenly',
        },
        wrap: {
            true: 'flex-wrap',
            false: 'flex-nowrap',
        },
    },
    defaultVariants: {
        direction: 'column',
        gap: 'md',
        align: 'stretch',
        justify: 'start',
        wrap: false,
    },
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface StackProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof stackVariants> {}

/**
 * Flexbox stack layout primitive.
 * Defaults to a vertical column with medium gap.
 */
export function Stack({ className, direction, gap, align, justify, wrap, ...props }: StackProps) {
    return (
        <div
            className={cn(stackVariants({ direction, gap, align, justify, wrap }), className)}
            {...props}
        />
    );
}
