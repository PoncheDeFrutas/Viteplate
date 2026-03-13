import { motion } from 'motion/react';
import { cn } from '@shared/lib/cn';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SegmentOption {
    value: string;
    label: ReactNode;
    disabled?: boolean;
}

interface SegmentedControlProps {
    /** Available segments. */
    options: SegmentOption[];
    /** Currently selected value. */
    value: string;
    /** Called when the selection changes. */
    onValueChange: (value: string) => void;
    /** Additional class names for the root container. */
    className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Segmented toggle control with a sliding indicator.
 */
export function SegmentedControl({
    options,
    value,
    onValueChange,
    className,
}: SegmentedControlProps) {
    return (
        <div
            role="radiogroup"
            className={cn('inline-flex items-center gap-0.5 rounded-lg bg-muted p-1', className)}
        >
            {options.map((option) => {
                const isSelected = option.value === value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        disabled={option.disabled}
                        onClick={() => onValueChange(option.value)}
                        className={cn(
                            'relative inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                            'disabled:pointer-events-none disabled:opacity-50',
                            isSelected
                                ? 'text-foreground'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {isSelected && (
                            <motion.span
                                layoutId="segmented-indicator"
                                className="absolute inset-0 rounded-md bg-background shadow-sm"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
