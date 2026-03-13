import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// RadioGroup (root)
// ---------------------------------------------------------------------------

type RadioGroupProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>;

/**
 * Accessible radio group built on Radix UI.
 * Compose with `RadioGroupItem` children.
 */
export function RadioGroup({ className, ...props }: RadioGroupProps) {
    return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} />;
}

// ---------------------------------------------------------------------------
// RadioGroupItem
// ---------------------------------------------------------------------------

type RadioGroupItemProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>;

/**
 * Individual radio option. Must be used inside a `RadioGroup`.
 */
export function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
    return (
        <RadioGroupPrimitive.Item
            className={cn(
                'aspect-square h-4 w-4 rounded-full border border-input text-primary',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'data-[state=checked]:border-primary',
                'transition-colors duration-150',
                className,
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                <Circle className="h-2.5 w-2.5 fill-current text-current" />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    );
}
