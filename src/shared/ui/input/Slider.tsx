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
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
                <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>
            {(props.defaultValue ?? props.value ?? [0]).map((_, i) => (
                <SliderPrimitive.Thumb
                    key={i}
                    className={cn(
                        'block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-transform',
                        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                        'disabled:pointer-events-none disabled:opacity-50',
                        'hover:scale-110 active:scale-95',
                    )}
                />
            ))}
        </SliderPrimitive.Root>
    );
}
