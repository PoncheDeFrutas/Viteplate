import { useEffect, useState } from 'react';
import { cn } from '@shared/lib/cn';
import type { HTMLAttributes, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface AffixProps extends HTMLAttributes<HTMLDivElement> {
    /** Offset from the top of the viewport in pixels (default `0`). */
    offsetTop?: number;
    /** Content to render. */
    children: ReactNode;
}

/**
 * Affix / Sticky wrapper that pins its content when scrolled past.
 * Uses CSS `position: sticky` for performance.
 */
export function Affix({ className, offsetTop = 0, children, style, ...props }: AffixProps) {
    const [stuck, setStuck] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setStuck(window.scrollY > offsetTop);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [offsetTop]);

    return (
        <div
            className={cn('sticky z-40 transition-shadow', stuck && 'shadow-sm', className)}
            style={{ top: offsetTop, ...style }}
            {...props}
        >
            {children}
        </div>
    );
}
