import { OTPInput } from 'input-otp';
import type { SlotProps } from 'input-otp';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

type PinInputProps = ComponentPropsWithoutRef<typeof OTPInput>;

/**
 * One-time password / PIN code input built on `input-otp`.
 *
 * Compose with `<PinInputGroup>` and `<PinInputSlot>` children.
 */
export function PinInput({ className, containerClassName, ...props }: PinInputProps) {
    return (
        <OTPInput
            containerClassName={cn(
                'flex items-center gap-2 has-[:disabled]:opacity-50',
                containerClassName,
            )}
            className={cn('disabled:cursor-not-allowed', className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Group
// ---------------------------------------------------------------------------

type PinInputGroupProps = ComponentPropsWithoutRef<'div'>;

export function PinInputGroup({ className, ...props }: PinInputGroupProps) {
    return <div className={cn('flex items-center gap-1', className)} {...props} />;
}

// ---------------------------------------------------------------------------
// Slot
// ---------------------------------------------------------------------------

interface PinInputSlotProps extends Omit<SlotProps, 'placeholderChar'> {
    className?: string;
    /** Override the placeholder character rendered when the slot is empty. */
    placeholderChar?: string | null;
}

export function PinInputSlot({ char, hasFakeCaret, isActive, className }: PinInputSlotProps) {
    return (
        <div
            className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-md border border-input text-sm tabular-nums transition-all',
                isActive && 'z-10 ring-2 ring-ring ring-offset-background',
                className,
            )}
        >
            {char}
            {hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-px animate-pulse bg-foreground duration-1000" />
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

type PinInputSeparatorProps = ComponentPropsWithoutRef<'div'>;

export function PinInputSeparator({ ...props }: PinInputSeparatorProps) {
    return (
        <div role="separator" {...props}>
            <span className="text-muted-foreground">&mdash;</span>
        </div>
    );
}
