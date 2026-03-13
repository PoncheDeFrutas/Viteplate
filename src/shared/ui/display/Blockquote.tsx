import { cn } from '@shared/lib/cn';
import type { HTMLAttributes, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface BlockquoteProps extends HTMLAttributes<HTMLQuoteElement> {
    /** Optional citation or attribution. */
    cite?: string;
    /** Footer content (e.g. author name). */
    footer?: ReactNode;
}

/**
 * Styled blockquote with optional citation footer.
 */
export function Blockquote({ className, cite, footer, children, ...props }: BlockquoteProps) {
    return (
        <figure className={cn('my-4', className)}>
            <blockquote
                cite={cite}
                className="border-l-4 border-primary/40 pl-4 italic text-foreground/80"
                {...props}
            >
                {children}
            </blockquote>
            {footer && (
                <figcaption className="mt-2 pl-4 text-sm text-muted-foreground">
                    &mdash; {footer}
                </figcaption>
            )}
        </figure>
    );
}
