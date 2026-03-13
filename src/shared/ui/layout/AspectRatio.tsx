import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import type { ComponentPropsWithoutRef } from 'react';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type AspectRatioProps = ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>;

/**
 * Maintain a consistent width-to-height ratio for any content.
 *
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <img src="..." className="h-full w-full object-cover" />
 * </AspectRatio>
 * ```
 */
export function AspectRatio(props: AspectRatioProps) {
    return <AspectRatioPrimitive.Root {...props} />;
}
