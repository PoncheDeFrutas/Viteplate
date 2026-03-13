import * as ToastPrimitive from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const ToastProvider = ToastPrimitive.Provider;

// ---------------------------------------------------------------------------
// Viewport
// ---------------------------------------------------------------------------

type ToastViewportProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>;

/**
 * Fixed viewport where toasts are rendered. Mount once near root.
 */
export function ToastViewport({ className, ...props }: ToastViewportProps) {
    return (
        <ToastPrimitive.Viewport
            className={cn(
                'fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:right-0 sm:bottom-0 sm:top-auto sm:flex-col md:max-w-[420px]',
                className,
            )}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// Toast variants
// ---------------------------------------------------------------------------

const toastVariants = cva(
    [
        'toast-animate group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all',
        '--toast-enter-x: 0 --toast-enter-y: 100% --toast-exit-x: 100% --toast-exit-y: 0',
    ],
    {
        variants: {
            variant: {
                default: 'border-border bg-background text-foreground',
                success: 'border-success/30 bg-success/10 text-success',
                warning: 'border-warning/30 bg-warning/10 text-warning',
                destructive: 'border-destructive/30 bg-destructive/10 text-destructive',
                info: 'border-info/30 bg-info/10 text-info',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------

interface ToastProps
    extends
        ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
        VariantProps<typeof toastVariants> {}

export function Toast({ className, variant, ...props }: ToastProps) {
    return <ToastPrimitive.Root className={cn(toastVariants({ variant }), className)} {...props} />;
}

// ---------------------------------------------------------------------------
// ToastAction
// ---------------------------------------------------------------------------

type ToastActionProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Action>;

export function ToastAction({ className, ...props }: ToastActionProps) {
    return (
        <ToastPrimitive.Action
            className={cn(
                'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium',
                'ring-offset-background transition-colors',
                'hover:bg-secondary',
                'focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none',
                'disabled:pointer-events-none disabled:opacity-50',
                className,
            )}
            {...props}
        />
    );
}

// ---------------------------------------------------------------------------
// ToastClose
// ---------------------------------------------------------------------------

type ToastCloseProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Close>;

export function ToastClose({ className, ...props }: ToastCloseProps) {
    return (
        <ToastPrimitive.Close
            className={cn(
                'absolute top-2 right-2 rounded-md p-1 opacity-0 transition-opacity',
                'hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-ring focus:outline-none',
                'group-hover:opacity-100',
                className,
            )}
            toast-close=""
            {...props}
        >
            <X className="h-4 w-4" />
        </ToastPrimitive.Close>
    );
}

// ---------------------------------------------------------------------------
// ToastTitle
// ---------------------------------------------------------------------------

type ToastTitleProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Title>;

export function ToastTitle({ className, ...props }: ToastTitleProps) {
    return <ToastPrimitive.Title className={cn('text-sm font-semibold', className)} {...props} />;
}

// ---------------------------------------------------------------------------
// ToastDescription
// ---------------------------------------------------------------------------

type ToastDescriptionProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Description>;

export function ToastDescription({ className, ...props }: ToastDescriptionProps) {
    return (
        <ToastPrimitive.Description className={cn('text-sm opacity-90', className)} {...props} />
    );
}
