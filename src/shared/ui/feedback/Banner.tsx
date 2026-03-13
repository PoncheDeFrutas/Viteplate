import { cva } from 'class-variance-authority';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const bannerVariants = cva('relative flex w-full items-start gap-3 rounded-lg border p-4 text-sm', {
    variants: {
        variant: {
            default: 'border-border bg-card text-card-foreground',
            info: 'border-info/30 bg-info/5 text-info-foreground',
            success: 'border-success/30 bg-success/5 text-success-foreground',
            warning: 'border-warning/30 bg-warning/5 text-warning-foreground',
            destructive: 'border-destructive/30 bg-destructive/5 text-destructive-foreground',
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
 * Similar to Alert but intended for richer, more prominent notices.
 * Animates in with a subtle fade and slide.
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
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="status"
            className={cn(bannerVariants({ variant }), className)}
        >
            {resolvedIcon && <span className="mt-0.5 shrink-0">{resolvedIcon}</span>}
            <div className="flex-1">
                {title && <h5 className="mb-1 font-semibold leading-tight">{title}</h5>}
                <div className="text-sm leading-relaxed [&_p]:leading-relaxed">{children}</div>
            </div>
            {dismissible && (
                <button
                    type="button"
                    onClick={onDismiss}
                    className="shrink-0 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    aria-label="Dismiss"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </motion.div>
    );
}
