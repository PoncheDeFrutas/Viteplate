import { cn } from '@shared/lib/cn';
import { linkVariants } from './link-variants';
import type { AnchorHTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface LinkProps
    extends AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof linkVariants> {
    /** Open in a new tab and apply `rel="noopener noreferrer"`. */
    external?: boolean;
}

/**
 * Styled anchor link primitive.
 *
 * For router-aware links, pass this component's `className` to TanStack's `Link`.
 * For plain anchors this works out of the box.
 */
export function StyledLink({ className, variant, size, external, ...props }: LinkProps) {
    return (
        <a
            className={cn(linkVariants({ variant, size }), className)}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            {...props}
        />
    );
}
