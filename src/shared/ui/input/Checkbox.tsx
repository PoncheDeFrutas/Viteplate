import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CheckboxProps extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
    /** Show an indeterminate (minus) icon instead of a checkmark. */
    indeterminate?: boolean;
}

/**
 * Accessible checkbox built on Radix UI.
 * Supports checked, unchecked, and indeterminate states.
 */
export function Checkbox({ className, indeterminate, checked, ...props }: CheckboxProps) {
    const resolvedChecked = indeterminate ? 'indeterminate' : checked;

    return (
        <CheckboxPrimitive.Root
            className={cn(
                'peer h-4 w-4 shrink-0 rounded-sm border border-input',
                'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
                'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
                className,
            )}
            checked={resolvedChecked}
            {...props}
        >
            <CheckboxPrimitive.Indicator className="flex items-center justify-center">
                {indeterminate ? (
                    <Minus className="h-3 w-3" strokeWidth={3} />
                ) : (
                    <Check className="h-3 w-3" strokeWidth={3} />
                )}
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}
