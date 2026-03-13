import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { cn } from '@shared/lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

export const Collapsible = CollapsiblePrimitive.Root;
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

// ---------------------------------------------------------------------------
// Content (animated via CSS)
// ---------------------------------------------------------------------------

type CollapsibleContentProps = ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>;

/**
 * Animated collapsible content panel.
 *
 * Uses `--radix-collapsible-content-height` for smooth CSS height animation.
 * Add matching keyframes in your global CSS (see `data-collapsible-content`).
 */
export function CollapsibleContent({ className, ...props }: CollapsibleContentProps) {
    return (
        <CollapsiblePrimitive.Content
            className={cn(
                'overflow-hidden',
                'data-[state=open]:animate-in data-[state=open]:fade-in-0',
                'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
                className,
            )}
            {...props}
        />
    );
}
