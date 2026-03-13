import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';

interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
    /** The error text to display. If falsy, nothing is rendered. */
    message?: string | null;
}

/**
 * Error message display. Renders as an alert banner for server/form-level
 * errors, or as inline text for field-level errors depending on usage.
 *
 * Returns `null` if `message` is falsy.
 */
export function ErrorMessage({ message, className, ...props }: ErrorMessageProps) {
    if (!message) {
        return null;
    }

    return (
        <div
            role="alert"
            className={cn(
                'rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive',
                className,
            )}
            {...props}
        >
            {message}
        </div>
    );
}
