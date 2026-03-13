import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cn } from '@shared/lib/cn';
import { toggleVariants } from './toggle-variants';
import type { ComponentPropsWithoutRef } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// ToggleGroup (root)
// ---------------------------------------------------------------------------

type ToggleGroupProps = ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>;

/**
 * A set of two-state toggle buttons where one or multiple can be active.
 */
export function ToggleGroup({ className, ...props }: ToggleGroupProps) {
    return (
        <ToggleGroupPrimitive.Root
            className={cn('flex items-center gap-1', className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// ToggleGroupItem
// ---------------------------------------------------------------------------

interface ToggleGroupItemProps
    extends
        ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
        VariantProps<typeof toggleVariants> {}

/**
 * Individual item inside a ToggleGroup.
 */
export function ToggleGroupItem({ className, variant, size, ...props }: ToggleGroupItemProps) {
    return (
        <ToggleGroupPrimitive.Item
            className={cn(toggleVariants({ variant, size }), className)}
            {...props}
        />
    );
}
