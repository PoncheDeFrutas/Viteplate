import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';

interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
    /** The error text to display. If falsy, nothing is rendered. */
    message?: string | null;
}

/**
 * Minimal error message with a left accent border.
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
                'border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive',
                className,
            )}
            {...props}
        >
            {message}
        </div>
    );
}
