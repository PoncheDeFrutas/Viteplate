import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------

type SliderProps = ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

/**
 * Range slider input with accessible keyboard support.
 * Supports single and multi-thumb (range) modes.
 */
export function Slider({ className, ...props }: SliderProps) {
    return (
        <SliderPrimitive.Root
            className={cn('relative flex w-full touch-none select-none items-center', className)}
            {...props}
        >
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden bg-secondary">
                <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>
            {(props.defaultValue ?? props.value ?? [0]).map((_, i) => (
                <SliderPrimitive.Thumb
                    key={i}
                    className={cn(
                        'block h-5 w-5 rounded-full border border-primary bg-background',
                        'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
                        'disabled:pointer-events-none disabled:opacity-50',
                    )}
                />
            ))}
        </SliderPrimitive.Root>
    );
}
