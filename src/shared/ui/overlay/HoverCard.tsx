import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

type HoverCardContentProps = ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>;

/**
 * Floating card that appears on hover for previewing content behind a trigger.
 */
export function HoverCardContent({
    className,
    align = 'center',
    sideOffset = 4,
    ...props
}: HoverCardContentProps) {
    return (
        <HoverCardPrimitive.Content
            align={align}
            sideOffset={sideOffset}
            data-floating-animate
            className={cn(
                'z-50 w-64 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none',
                className,
            )}
            {...props}
        />
    );
}
