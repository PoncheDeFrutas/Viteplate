import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@shared/lib/cn';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CopyButtonProps {
    /** The text to copy to the clipboard. */
    value: string;
    /** Duration in ms to show the success state (default `2000`). */
    successDuration?: number;
    /** Additional class names. */
    className?: string;
}

/**
 * One-click copy-to-clipboard button with animated feedback.
 */
export function CopyButton({ value, successDuration = 2000, className }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        const textarea = document.createElement('textarea');

        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';

        document.body.appendChild(textarea);
        textarea.select();

        const didCopy = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (!didCopy) {
            return;
        }

        setCopied(true);
        setTimeout(() => setCopied(false), successDuration);
    }, [successDuration, value]);

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors',
                'hover:bg-accent hover:text-foreground',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                className,
            )}
            aria-label={copied ? 'Copied' : 'Copy to clipboard'}
        >
            <motion.span
                key={copied ? 'check' : 'copy'}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </motion.span>
        </button>
    );
}
