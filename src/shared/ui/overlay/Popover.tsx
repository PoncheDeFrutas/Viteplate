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
                className={cn(
                    'z-50 w-72 border border-border bg-popover p-3 text-popover-foreground outline-none',
                    className,
                )}
                {...props}
            />
        </PopoverPrimitive.Portal>
    );
}
