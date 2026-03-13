import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Provider (mount once near root)
// ---------------------------------------------------------------------------

export const TooltipProvider = TooltipPrimitive.Provider;

// ---------------------------------------------------------------------------
// Tooltip (root — re-export for convenience)
// ---------------------------------------------------------------------------

export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>;

/**
 * Tooltip content panel. Wraps Radix `TooltipPrimitive.Content` with
 * consistent styling, animation classes, and portal rendering.
 */
export function TooltipContent({ className, sideOffset = 4, ...props }: TooltipContentProps) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                sideOffset={sideOffset}
                className={cn(
                    'z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
                    'animate-in fade-in-0 zoom-in-95',
                    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                    className,
                )}
                {...props}
            />
        </TooltipPrimitive.Portal>
    );
}

// ---------------------------------------------------------------------------
// Convenience wrapper
// ---------------------------------------------------------------------------

interface SimpleTooltipProps {
    /** The content to show in the tooltip. */
    content: ReactNode;
    /** The element that triggers the tooltip. */
    children: ReactNode;
    /** Side of the trigger to show the tooltip. */
    side?: 'top' | 'right' | 'bottom' | 'left';
    /** Delay in ms before showing the tooltip. */
    delayDuration?: number;
}

/**
 * All-in-one tooltip shorthand.
 *
 * ```tsx
 * <SimpleTooltip content="Copy to clipboard">
 *   <Button variant="ghost" size="icon">...</Button>
 * </SimpleTooltip>
 * ```
 */
export function SimpleTooltip({
    content,
    children,
    side = 'top',
    delayDuration = 200,
}: SimpleTooltipProps) {
    return (
        <Tooltip delayDuration={delayDuration}>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side={side}>{content}</TooltipContent>
        </Tooltip>
    );
}
