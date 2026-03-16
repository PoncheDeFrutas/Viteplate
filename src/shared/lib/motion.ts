import { useReducedMotion } from 'motion/react';
import type { MotionProps } from 'motion/react';

interface RevealOptions {
    delay?: number;
    distance?: number;
    duration?: number;
    amount?: number;
}

const EASE_STANDARD = [0.22, 1, 0.36, 1] as const;

/**
 * Shared motion presets for page-level reveals and micro-interactions.
 * Designed to keep timing and easing consistent across public pages.
 */
export function useMotionPresets() {
    const reducedMotion = useReducedMotion();

    function reveal(options?: RevealOptions): MotionProps {
        const delay = options?.delay ?? 0;
        const distance = options?.distance ?? 18;
        const duration = options?.duration ?? 0.48;
        const amount = options?.amount ?? 0.25;

        if (reducedMotion) {
            return {
                initial: false,
                whileInView: {},
                viewport: { once: true },
            };
        }

        return {
            initial: { opacity: 0, y: distance },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount },
            transition: { duration, ease: EASE_STANDARD, delay },
        };
    }

    function sequence(index: number, start = 0.06, step = 0.06): MotionProps {
        return reveal({ delay: start + index * step });
    }

    return {
        reducedMotion,
        reveal,
        sequence,
    };
}
