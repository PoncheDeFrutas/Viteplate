import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

// ---------------------------------------------------------------------------
// Overlay
// ---------------------------------------------------------------------------

function DrawerOverlay({
    className,
    ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            className={cn(
                'fixed inset-0 z-50 bg-black/80',
                'data-[state=open]:animate-in data-[state=open]:fade-in-0',
                'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
                className,
            )}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Content variants
// ---------------------------------------------------------------------------

const drawerContentVariants = cva(
    'fixed z-50 gap-4 border border-border bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out',
    {
        variants: {
            side: {
                right: 'inset-y-0 right-0 h-full w-3/4 max-w-sm data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right',
                left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left',
                top: 'inset-x-0 top-0 data-[state=open]:animate-in data-[state=open]:slide-in-from-top data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top',
                bottom: 'inset-x-0 bottom-0 data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom',
            },
        },
        defaultVariants: {
            side: 'right',
        },
    },
);

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

interface DrawerContentProps
    extends
        ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
        VariantProps<typeof drawerContentVariants> {
    /** Hide the default close button. */
    hideClose?: boolean;
}

/**
 * Slide-in drawer panel built on Radix Dialog.
 * Sides: `left`, `right`, `top`, `bottom`.
 */
export function DrawerContent({
    className,
    children,
    side,
    hideClose,
    ...props
}: DrawerContentProps) {
    return (
        <DialogPrimitive.Portal>
            <DrawerOverlay />
            <DialogPrimitive.Content
                className={cn(drawerContentVariants({ side }), className)}
                {...props}
            >
                {children}
                {!hideClose && (
                    <DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
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

type DrawerHeaderProps = ComponentPropsWithoutRef<'div'>;

export function DrawerHeader({ className, ...props }: DrawerHeaderProps) {
    return <div className={cn('flex flex-col gap-1.5', className)} {...props} />;
}

type DrawerFooterProps = ComponentPropsWithoutRef<'div'>;

export function DrawerFooter({ className, ...props }: DrawerFooterProps) {
    return (
        <div
            className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
            {...props}
        />
    );
}

type DrawerTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

export function DrawerTitle({ className, ...props }: DrawerTitleProps) {
    return (
        <DialogPrimitive.Title
            className={cn('text-lg font-semibold leading-none tracking-tight', className)}
            {...props}
        />
    );
}

type DrawerDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;

export function DrawerDescription({ className, ...props }: DrawerDescriptionProps) {
    return (
        <DialogPrimitive.Description
            className={cn('text-sm text-muted-foreground', className)}
            {...props}
        />
    );
}
