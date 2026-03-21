import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

// ---------------------------------------------------------------------------
// Portal + Overlay
// ---------------------------------------------------------------------------

type DialogOverlayProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

function DialogOverlay({ className, ...props }: DialogOverlayProps) {
    return (
        <DialogPrimitive.Overlay
            className={cn('fixed inset-0 z-50 bg-black/40', className)}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

interface DialogContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
    /** Hide the default close button. */
    hideClose?: boolean;
}

/**
 * Centred dialog panel with backdrop overlay.
 */
export function DialogContent({ className, children, hideClose, ...props }: DialogContentProps) {
    return (
        <DialogPrimitive.Portal>
            <DialogOverlay />
            <DialogPrimitive.Content
                className={cn(
                    'fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-3 border border-border bg-background p-4',
                    className,
                )}
                {...props}
            >
                {children}
                {!hideClose && (
                    <DialogPrimitive.Close className="absolute top-3 right-3 p-1 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
}

// ---------------------------------------------------------------------------
// Header / Footer / Title / Description
// ---------------------------------------------------------------------------

type DialogHeaderProps = ComponentPropsWithoutRef<'div'>;

export function DialogHeader({ className, ...props }: DialogHeaderProps) {
    return (
        <div
            className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)}
            {...props}
        />
    );
}

type DialogFooterProps = ComponentPropsWithoutRef<'div'>;

export function DialogFooter({ className, ...props }: DialogFooterProps) {
    return (
        <div
            className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2', className)}
            {...props}
        />
    );
}

type DialogTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

export function DialogTitle({ className, ...props }: DialogTitleProps) {
    return (
        <DialogPrimitive.Title
            className={cn('text-lg font-semibold leading-none tracking-tight', className)}
            {...props}
        />
    );
}

type DialogDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;

export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
    return (
        <DialogPrimitive.Description
            className={cn('text-sm text-muted-foreground', className)}
            {...props}
        />
    );
}
