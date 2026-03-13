/**
 * Shared Framer Motion animation presets for page enter transitions.
 *
 * Used by HomePage, AboutPage, and StackPage to animate elements
 * upward with a fade-in on mount. Centralised here to avoid duplication.
 */

/** Fade up from 20 px below with a smooth ease curve. */
export const FADE_UP = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
} as const;

/**
 * Returns a `FADE_UP` variant with a staggered delay based on `index`.
 *
 * @param index  - Zero-based position in a list.
 * @param offset - Base delay before the first item (default `0.05`).
 * @param step   - Incremental delay per item (default `0.06`).
 */
export function stagger(index: number, offset = 0.05, step = 0.06) {
    return { ...FADE_UP, transition: { ...FADE_UP.transition, delay: offset + index * step } };
}
