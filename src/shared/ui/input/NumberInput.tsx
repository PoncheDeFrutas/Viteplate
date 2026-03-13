import { useCallback, useRef } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { InputHTMLAttributes } from 'react';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface NumberInputProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'type'
> {
    /** Current numeric value. */
    value?: number;
    /** Called with the new value on change. */
    onValueChange?: (value: number) => void;
    /** Minimum allowed value. */
    min?: number;
    /** Maximum allowed value. */
    max?: number;
    /** Step increment (default `1`). */
    step?: number;
    /** Hide the +/- stepper buttons. */
    hideStepper?: boolean;
}

/**
 * Numeric input with optional stepper buttons.
 */
export function NumberInput({
    className,
    value,
    onValueChange,
    min,
    max,
    step = 1,
    hideStepper,
    disabled,
    ...props
}: NumberInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const clamp = useCallback(
        (v: number) => {
            let clamped = v;
            if (min !== undefined) clamped = Math.max(min, clamped);
            if (max !== undefined) clamped = Math.min(max, clamped);
            return clamped;
        },
        [min, max],
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value;
            if (raw === '' || raw === '-') return;
            const parsed = Number(raw);
            if (!Number.isNaN(parsed)) {
                onValueChange?.(clamp(parsed));
            }
        },
        [clamp, onValueChange],
    );

    const increment = useCallback(() => {
        const next = clamp((value ?? 0) + step);
        onValueChange?.(next);
    }, [clamp, onValueChange, step, value]);

    const decrement = useCallback(() => {
        const next = clamp((value ?? 0) - step);
        onValueChange?.(next);
    }, [clamp, onValueChange, step, value]);

    const stepperButton =
        'flex h-full items-center justify-center px-2 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50';

    return (
        <div
            className={cn(
                'flex h-9 items-center overflow-hidden rounded-md border border-input bg-transparent text-sm',
                'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
                disabled && 'pointer-events-none opacity-50',
                className,
            )}
        >
            {!hideStepper && (
                <button
                    type="button"
                    tabIndex={-1}
                    disabled={disabled || (min !== undefined && (value ?? 0) <= min)}
                    onClick={decrement}
                    className={cn(stepperButton, 'border-r border-input')}
                    aria-label="Decrease"
                >
                    <Minus className="h-3.5 w-3.5" />
                </button>
            )}
            <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                value={value ?? ''}
                onChange={handleChange}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                className={cn(
                    'h-full w-full flex-1 bg-transparent px-3 text-center tabular-nums outline-none',
                    '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                )}
                {...props}
            />
            {!hideStepper && (
                <button
                    type="button"
                    tabIndex={-1}
                    disabled={disabled || (max !== undefined && (value ?? 0) >= max)}
                    onClick={increment}
                    className={cn(stepperButton, 'border-l border-input')}
                    aria-label="Increase"
                >
                    <Plus className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}
