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
 * Segmented toggle control.
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
            className={cn(
                'inline-flex items-center gap-1 border border-border bg-muted p-1',
                className,
            )}
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
                            'inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium',
                            'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
                            'disabled:pointer-events-none disabled:opacity-50',
                            isSelected ? 'bg-background text-foreground' : 'text-muted-foreground',
                        )}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
