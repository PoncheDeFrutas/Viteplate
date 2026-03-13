import { cn } from '@shared/lib/cn';
import type { LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    /** Visually marks the associated field as required. */
    required?: boolean;
}

/**
 * Accessible form label with consistent styling.
 */
export function Label({ className, children, required, ...props }: LabelProps) {
    return (
        <label className={cn('block text-sm font-medium text-foreground', className)} {...props}>
            {children}
            {required && <span className="ml-0.5 text-destructive">*</span>}
        </label>
    );
}
