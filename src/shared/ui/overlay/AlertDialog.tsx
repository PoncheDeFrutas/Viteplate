import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;

// ---------------------------------------------------------------------------
// Overlay
// ---------------------------------------------------------------------------

type AlertDialogOverlayProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>;

function AlertDialogOverlay({ className, ...props }: AlertDialogOverlayProps) {
    return (
        <AlertDialogPrimitive.Overlay
            className={cn('fixed inset-0 z-50 bg-black/40', className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

type AlertDialogContentProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>;

/**
 * Modal panel that interrupts the user and requires an explicit response.
 * Traps focus and prevents backdrop dismiss (unlike Dialog).
 */
export function AlertDialogContent({ className, ...props }: AlertDialogContentProps) {
    return (
        <AlertDialogPrimitive.Portal>
            <AlertDialogOverlay />
            <AlertDialogPrimitive.Content
                className={cn(
                    'fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-3 border border-border bg-background p-4',
                    className,
                )}
                {...props}
            />
        </AlertDialogPrimitive.Portal>
    );
}

// ---------------------------------------------------------------------------
// Header / Footer / Title / Description
// ---------------------------------------------------------------------------

type AlertDialogHeaderProps = ComponentPropsWithoutRef<'div'>;

export function AlertDialogHeader({ className, ...props }: AlertDialogHeaderProps) {
    return (
        <div className={cn('flex flex-col gap-2 text-center sm:text-left', className)} {...props} />
    );
}

type AlertDialogFooterProps = ComponentPropsWithoutRef<'div'>;

export function AlertDialogFooter({ className, ...props }: AlertDialogFooterProps) {
    return (
        <div
            className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2', className)}
            {...props}
        />
    );
}

type AlertDialogTitleProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>;

export function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps) {
    return (
        <AlertDialogPrimitive.Title className={cn('text-lg font-semibold', className)} {...props} />
    );
}

type AlertDialogDescriptionProps = ComponentPropsWithoutRef<
    typeof AlertDialogPrimitive.Description
>;

export function AlertDialogDescription({ className, ...props }: AlertDialogDescriptionProps) {
    return (
        <AlertDialogPrimitive.Description
            className={cn('text-sm text-muted-foreground', className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Action (destructive by default)
// ---------------------------------------------------------------------------

type AlertDialogActionProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>;

export function AlertDialogAction({ className, ...props }: AlertDialogActionProps) {
    return (
        <AlertDialogPrimitive.Action
            className={cn(
                'inline-flex h-9 items-center justify-center border border-destructive bg-destructive px-3 text-sm text-destructive-foreground',
                'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
                'disabled:pointer-events-none disabled:opacity-50',
                className,
            )}
            {...props}
        />
    );
}
