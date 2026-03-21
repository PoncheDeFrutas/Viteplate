import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// ScrollBar
// ---------------------------------------------------------------------------

type ScrollBarProps = ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>;

function ScrollBar({ className, orientation = 'vertical', ...props }: ScrollBarProps) {
    return (
        <ScrollAreaPrimitive.Scrollbar
            orientation={orientation}
            className={cn(
                'flex touch-none select-none',
                orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-px',
                orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-px',
                className,
            )}
            {...props}
        >
            <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
        </ScrollAreaPrimitive.Scrollbar>
    );
}

// ---------------------------------------------------------------------------
// ScrollArea
// ---------------------------------------------------------------------------

interface ScrollAreaProps extends ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
    /** Orientation of the visible scrollbar(s). Defaults to `"vertical"`. */
    orientation?: 'vertical' | 'horizontal' | 'both';
}

/**
 * Custom-styled scroll container using native scroll behaviour underneath.
 */
export function ScrollArea({
    className,
    children,
    orientation = 'vertical',
    ...props
}: ScrollAreaProps) {
    return (
        <ScrollAreaPrimitive.Root className={cn('relative overflow-hidden', className)} {...props}>
            <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
                {children}
            </ScrollAreaPrimitive.Viewport>
            {(orientation === 'vertical' || orientation === 'both') && (
                <ScrollBar orientation="vertical" />
            )}
            {(orientation === 'horizontal' || orientation === 'both') && (
                <ScrollBar orientation="horizontal" />
            )}
            <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
    );
}
