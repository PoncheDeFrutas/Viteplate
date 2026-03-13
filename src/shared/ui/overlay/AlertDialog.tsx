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
            data-overlay-animate
            className={cn('fixed inset-0 z-50 bg-black/80', className)}
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
                data-dialog-animate
                className={cn(
                    'fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg sm:rounded-lg',
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
                'inline-flex h-10 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground ring-offset-background transition-colors',
                'hover:bg-destructive/90',
                'focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none',
                'disabled:pointer-events-none disabled:opacity-50',
                className,
            )}
            {...props}
        />
    );
}
