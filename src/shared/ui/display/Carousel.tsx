import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Extract the options type from the hook's first parameter. */
type EmblaOptions = NonNullable<Parameters<typeof useEmblaCarousel>[0]>;

interface CarouselState {
    canScrollPrev: boolean;
    canScrollNext: boolean;
    selectedIndex: number;
    slideCount: number;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

interface CarouselProps {
    /** Slides to render. */
    children: ReactNode;
    /** Embla carousel options. */
    options?: EmblaOptions;
    /** Show navigation arrows. */
    showArrows?: boolean;
    /** Show dot indicators. */
    showDots?: boolean;
    /** Additional class names. */
    className?: string;
}

/**
 * Carousel / slider built on Embla Carousel.
 */
export function Carousel({
    children,
    options,
    showArrows = true,
    showDots = true,
    className,
}: CarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, ...options });
    const [state, setState] = useState<CarouselState>({
        canScrollPrev: false,
        canScrollNext: false,
        selectedIndex: 0,
        slideCount: 0,
    });

    const syncState = useCallback(() => {
        if (!emblaApi) return;
        const next: CarouselState = {
            canScrollPrev: emblaApi.canScrollPrev(),
            canScrollNext: emblaApi.canScrollNext(),
            selectedIndex: emblaApi.selectedScrollSnap(),
            slideCount: emblaApi.scrollSnapList().length,
        };
        setState(next);
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', syncState);
        emblaApi.on('reInit', syncState);
        // Schedule initial sync outside the effect body to avoid the lint rule.
        const id = requestAnimationFrame(syncState);
        return () => {
            cancelAnimationFrame(id);
            emblaApi.off('select', syncState);
            emblaApi.off('reInit', syncState);
        };
    }, [emblaApi, syncState]);

    const { canScrollPrev, canScrollNext, selectedIndex, slideCount } = state;

    return (
        <div className={cn('relative', className)}>
            {/* Viewport */}
            <div ref={emblaRef} className="overflow-hidden border border-border">
                <div className="flex">{children}</div>
            </div>

            {/* Arrows */}
            {showArrows && (
                <>
                    <CarouselButton
                        direction="prev"
                        disabled={!canScrollPrev}
                        onClick={() => emblaApi?.scrollPrev()}
                    />
                    <CarouselButton
                        direction="next"
                        disabled={!canScrollNext}
                        onClick={() => emblaApi?.scrollNext()}
                    />
                </>
            )}

            {/* Dots */}
            {showDots && slideCount > 1 && (
                <div className="mt-3 flex justify-center gap-1.5">
                    {Array.from({ length: slideCount }).map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => emblaApi?.scrollTo(i)}
                            className={cn(
                                'relative h-2 w-2 rounded-full border border-border',
                                i === selectedIndex && 'bg-primary',
                            )}
                        >
                            <span className="sr-only">Slide {i + 1}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Slide
// ---------------------------------------------------------------------------

interface CarouselSlideProps {
    children: ReactNode;
    className?: string;
}

export function CarouselSlide({ children, className }: CarouselSlideProps) {
    return <div className={cn('min-w-0 flex-[0_0_100%] px-1', className)}>{children}</div>;
}

// ---------------------------------------------------------------------------
// Button (internal)
// ---------------------------------------------------------------------------

interface CarouselButtonProps {
    direction: 'prev' | 'next';
    disabled: boolean;
    onClick: () => void;
}

function CarouselButton({ direction, disabled, onClick }: CarouselButtonProps) {
    const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={cn(
                'absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-border bg-background text-foreground',
                'disabled:pointer-events-none disabled:opacity-30',
                direction === 'prev' ? 'left-2' : 'right-2',
            )}
            aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
        >
            <Icon className="h-4 w-4" />
        </button>
    );
}
