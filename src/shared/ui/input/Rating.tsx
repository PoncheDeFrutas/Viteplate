import { useState, useCallback } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@shared/lib/cn';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface RatingProps {
    /** Current value (0 to max). */
    value?: number;
    /** Called when the user selects a rating. */
    onValueChange?: (value: number) => void;
    /** Maximum rating value (default `5`). */
    max?: number;
    /** Size of each star in pixels (default `20`). */
    size?: number;
    /** Make the rating read-only. */
    readOnly?: boolean;
    /** Additional class names. */
    className?: string;
}

/**
 * Star rating input.
 */
export function Rating({
    value = 0,
    onValueChange,
    max = 5,
    size = 20,
    readOnly,
    className,
}: RatingProps) {
    const [hovered, setHovered] = useState<number | null>(null);
    const displayValue = hovered ?? value;

    const handleClick = useCallback(
        (index: number) => {
            if (readOnly) return;
            onValueChange?.(index === value ? 0 : index);
        },
        [onValueChange, readOnly, value],
    );

    return (
        <div
            className={cn('inline-flex items-center gap-0.5', className)}
            onMouseLeave={() => setHovered(null)}
            role="radiogroup"
            aria-label="Rating"
        >
            {Array.from({ length: max }, (_, i) => i + 1).map((index) => {
                const filled = index <= displayValue;
                return (
                    <button
                        key={index}
                        type="button"
                        disabled={readOnly}
                        onClick={() => handleClick(index)}
                        onMouseEnter={() => !readOnly && setHovered(index)}
                        className={cn(
                            'cursor-pointer focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
                            readOnly && 'cursor-default',
                        )}
                        role="radio"
                        aria-checked={index === value}
                        aria-label={`${index} star${index > 1 ? 's' : ''}`}
                    >
                        <Star
                            style={{ width: size, height: size }}
                            className={cn(
                                filled
                                    ? 'fill-warning text-warning'
                                    : 'fill-transparent text-border',
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}
