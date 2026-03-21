import type { MotionProps } from 'motion/react';

interface RevealOptions {
    delay?: number;
    distance?: number;
    duration?: number;
    amount?: number;
}

export function useMotionPresets() {
    function reveal(options?: RevealOptions): MotionProps {
        void options;

        return {
            initial: false,
            whileInView: {},
            viewport: { once: true },
        };
    }

    function sequence(index = 0, start = 0.06, step = 0.06): MotionProps {
        void index;
        void start;
        void step;

        return reveal();
    }

    return {
        reducedMotion: true,
        reveal,
        sequence,
    };
}
