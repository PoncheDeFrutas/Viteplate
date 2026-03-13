import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

export const Collapsible = CollapsiblePrimitive.Root;
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

// ---------------------------------------------------------------------------
// Content (animated via CSS keyframes in index.css)
// ---------------------------------------------------------------------------

type CollapsibleContentProps = ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>;

/**
 * Animated collapsible content panel.
 *
 * Uses `--radix-collapsible-content-height` for a smooth height transition.
 * The matching `collapsible-down` / `collapsible-up` keyframes live in the
 * global CSS under `[data-collapsible-content]`.
 */
export function CollapsibleContent({ className, ...props }: CollapsibleContentProps) {
    return (
        <CollapsiblePrimitive.Content
            data-collapsible-content=""
            className={cn('overflow-hidden', className)}
            {...props}
        />
    );
}
