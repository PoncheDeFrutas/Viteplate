import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cn } from '@shared/lib/cn';
import { toggleVariants } from './toggle-variants';
import type { ComponentPropsWithoutRef } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ToggleProps
    extends
        ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
        VariantProps<typeof toggleVariants> {}

/**
 * Pressable toggle button that switches between on/off states.
 */
export function Toggle({ className, variant, size, ...props }: ToggleProps) {
    return (
        <TogglePrimitive.Root
            className={cn(toggleVariants({ variant, size }), className)}
            {...props}
        />
    );
}
