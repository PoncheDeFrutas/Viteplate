import { cn } from '@shared/lib/cn';
import type { HTMLAttributes } from 'react';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
    /** Optional label shown above the code block. */
    label?: string;
}

/**
 * Styled `<pre>` block for displaying code or terminal output.
 *
 * Applies a monospace font, subtle background, and horizontal scroll
 * when the content overflows.
 */
export function CodeBlock({ className, label, children, ...props }: CodeBlockProps) {
    return (
        <div className="space-y-1.5">
            {label && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
            <pre
                className={cn(
                    'overflow-x-auto border border-border bg-muted p-3',
                    'font-mono text-sm leading-relaxed text-foreground',
                    className,
                )}
                {...props}
            >
                {children}
            </pre>
        </div>
    );
}
