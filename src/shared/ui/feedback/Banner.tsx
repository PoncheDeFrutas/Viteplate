import { cva } from 'class-variance-authority';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const bannerVariants = cva('relative flex w-full items-start gap-3 rounded border p-3 text-sm', {
    variants: {
        variant: {
            default: 'border-border bg-card text-card-foreground',
            info: 'border-info bg-card text-card-foreground',
            success: 'border-success bg-card text-card-foreground',
            warning: 'border-warning bg-card text-card-foreground',
            destructive: 'border-destructive bg-card text-card-foreground',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

// ---------------------------------------------------------------------------
// Icon map
// ---------------------------------------------------------------------------

const BANNER_ICONS: Record<string, ReactNode> = {
    default: <Info className="h-5 w-5 text-muted-foreground" />,
    info: <Info className="h-5 w-5 text-info" />,
    success: <CheckCircle2 className="h-5 w-5 text-success" />,
    warning: <TriangleAlert className="h-5 w-5 text-warning" />,
    destructive: <AlertCircle className="h-5 w-5 text-destructive" />,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface BannerProps extends VariantProps<typeof bannerVariants> {
    /** Banner title (bold). */
    title?: string;
    /** Override the automatic icon. Pass `null` to hide. */
    icon?: ReactNode | null;
    /** Show a dismiss button. */
    dismissible?: boolean;
    /** Called when dismiss is clicked. */
    onDismiss?: () => void;
    /** Content. */
    children?: ReactNode;
    /** Additional class names. */
    className?: string;
}

/**
 * Callout/banner for important contextual messages.
 * Similar to Alert but intended for wider contextual messages.
 */
export function Banner({
    className,
    variant,
    title,
    icon,
    dismissible,
    onDismiss,
    children,
}: BannerProps) {
    const resolvedVariant = variant ?? 'default';
    const resolvedIcon = icon === null ? null : (icon ?? BANNER_ICONS[resolvedVariant]);

    return (
        <div role="status" className={cn(bannerVariants({ variant }), className)}>
            {resolvedIcon && <span className="mt-0.5 shrink-0">{resolvedIcon}</span>}
            <div className="flex-1">
                {title && <h5 className="mb-1 font-semibold leading-tight">{title}</h5>}
                <div className="text-sm leading-relaxed [&_p]:leading-relaxed">{children}</div>
            </div>
            {dismissible && (
                <button
                    type="button"
                    onClick={onDismiss}
                    className="shrink-0 rounded p-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    aria-label="Dismiss"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
