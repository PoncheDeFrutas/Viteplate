import { cn } from '@shared/lib/cn';
import type { LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    /** Visually marks the associated field as required. */
    required?: boolean;
}

/**
 * Accessible form label. Clean, small, medium-weight.
 */
export function Label({ className, children, required, ...props }: LabelProps) {
    return (
        <label
            className={cn(
                'text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                className,
            )}
            {...props}
        >
            {children}
            {required && <span className="ml-0.5 text-destructive">*</span>}
        </label>
    );
}
