import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const switchVariants = cva(
    [
        'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=unchecked]:bg-input',
    ],
    {
        variants: {
            size: {
                sm: 'h-4 w-7',
                md: 'h-5 w-9',
                lg: 'h-6 w-11',
            },
            variant: {
                default: 'data-[state=checked]:bg-primary',
                success: 'data-[state=checked]:bg-success',
                destructive: 'data-[state=checked]:bg-destructive',
            },
        },
        defaultVariants: {
            size: 'md',
            variant: 'default',
        },
    },
);

const thumbSizeMap = {
    sm: 'h-3 w-3 data-[state=checked]:translate-x-3',
    md: 'h-4 w-4 data-[state=checked]:translate-x-4',
    lg: 'h-5 w-5 data-[state=checked]:translate-x-5',
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface SwitchProps
    extends
        ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
        VariantProps<typeof switchVariants> {}

/**
 * Toggle switch built on Radix UI.
 * Sizes: `sm`, `md`, `lg`. Colour variants: `default`, `success`, `destructive`.
 */
export function Switch({ className, size, variant, ...props }: SwitchProps) {
    const resolvedSize = size ?? 'md';

    return (
        <SwitchPrimitive.Root
            className={cn(switchVariants({ size: resolvedSize, variant }), className)}
            {...props}
        >
            <SwitchPrimitive.Thumb
                className={cn(
                    'pointer-events-none block rounded-full bg-background',
                    'data-[state=unchecked]:translate-x-0',
                    thumbSizeMap[resolvedSize],
                )}
            />
        </SwitchPrimitive.Root>
    );
}
