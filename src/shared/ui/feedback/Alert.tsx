import { cva } from 'class-variance-authority';
import { cn } from '@shared/lib/cn';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const alertVariants = cva(
    'relative flex w-full gap-3 rounded-lg border p-4 text-sm [&>svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'border-border bg-background text-foreground',
                info: 'border-info/30 bg-info/5 text-info [&>svg]:text-info',
                success: 'border-success/30 bg-success/5 text-success [&>svg]:text-success',
                warning: 'border-warning/30 bg-warning/5 text-warning [&>svg]:text-warning',
                destructive:
                    'border-destructive/30 bg-destructive/5 text-destructive [&>svg]:text-destructive',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

// ---------------------------------------------------------------------------
// Icon map
// ---------------------------------------------------------------------------

const ALERT_ICONS: Record<string, ReactNode> = {
    default: <Info className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
    success: <CheckCircle2 className="h-4 w-4" />,
    warning: <TriangleAlert className="h-4 w-4" />,
    destructive: <AlertCircle className="h-4 w-4" />,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface AlertProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
    /** Alert title (bold heading). */
    title?: string;
    /** Override the automatic icon. Pass `null` to hide. */
    icon?: ReactNode | null;
    /** Show a dismiss button. Calls `onDismiss` when clicked. */
    dismissible?: boolean;
    /** Callback fired when the dismiss button is clicked. */
    onDismiss?: () => void;
}

/**
 * Alert banner for messages, warnings, and errors.
 * Automatically selects an icon based on the variant.
 */
export function Alert({
    className,
    variant,
    title,
    icon,
    dismissible,
    onDismiss,
    children,
    ...props
}: AlertProps) {
    const resolvedVariant = variant ?? 'default';
    const resolvedIcon = icon === null ? null : (icon ?? ALERT_ICONS[resolvedVariant]);

    return (
        <div role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
            {resolvedIcon}
            <div className="flex-1">
                {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
                <div className="text-sm [&_p]:leading-relaxed">{children}</div>
            </div>
            {dismissible && (
                <button
                    type="button"
                    onClick={onDismiss}
                    className="absolute top-3 right-3 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    aria-label="Dismiss"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
