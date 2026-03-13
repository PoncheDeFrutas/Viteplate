import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>;

/**
 * Floating popover panel anchored to the trigger.
 */
export function PopoverContent({
    className,
    align = 'center',
    sideOffset = 4,
    ...props
}: PopoverContentProps) {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                align={align}
                sideOffset={sideOffset}
                data-floating-animate
                className={cn(
                    'z-50 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none',
                    className,
                )}
                {...props}
            />
        </PopoverPrimitive.Portal>
    );
}
