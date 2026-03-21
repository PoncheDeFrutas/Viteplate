import { cva } from 'class-variance-authority';
import { Check } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const stepVariants = cva(
    'flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium',
    {
        variants: {
            state: {
                completed: 'border-primary bg-primary text-primary-foreground',
                active: 'border-primary bg-background text-primary',
                upcoming: 'border-border bg-background text-muted-foreground',
            },
        },
        defaultVariants: {
            state: 'upcoming',
        },
    },
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StepItem {
    /** Label shown below/beside the step circle. */
    label: string;
    /** Optional description. */
    description?: string;
    /** Override icon inside the step circle. */
    icon?: ReactNode;
}

interface StepperProps {
    /** Step definitions. */
    steps: StepItem[];
    /** Zero-based index of the currently active step. */
    activeStep: number;
    /** Layout direction. */
    orientation?: 'horizontal' | 'vertical';
    /** Additional class names. */
    className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getState(index: number, active: number): VariantProps<typeof stepVariants>['state'] {
    if (index < active) return 'completed';
    if (index === active) return 'active';
    return 'upcoming';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Multi-step progress indicator.
 */
export function Stepper({
    steps,
    activeStep,
    orientation = 'horizontal',
    className,
}: StepperProps) {
    const isVertical = orientation === 'vertical';

    return (
        <nav
            aria-label="Progress"
            className={cn('flex', isVertical ? 'flex-col gap-0' : 'items-start gap-0', className)}
        >
            {steps.map((step, i) => {
                const state = getState(i, activeStep);
                const isLast = i === steps.length - 1;

                return (
                    <div
                        key={i}
                        className={cn(
                            'flex',
                            isVertical
                                ? 'flex-row items-start gap-3'
                                : 'flex-1 flex-col items-center gap-1.5',
                        )}
                    >
                        {/* Circle + connector */}
                        <div
                            className={cn('flex items-center', isVertical ? 'flex-col' : 'w-full')}
                        >
                            {!isVertical && i > 0 && (
                                <div className="h-0.5 flex-1">
                                    <div
                                        className={cn(
                                            'h-full',
                                            state === 'upcoming' ? 'bg-border' : 'bg-primary',
                                        )}
                                    />
                                </div>
                            )}

                            <div className={cn(stepVariants({ state }))}>
                                {state === 'completed' ? (
                                    <span>
                                        <Check className="h-4 w-4" />
                                    </span>
                                ) : (
                                    (step.icon ?? i + 1)
                                )}
                            </div>

                            {!isVertical && !isLast && (
                                <div className="h-0.5 flex-1">
                                    <div
                                        className={cn(
                                            'h-full',
                                            state === 'completed' ? 'bg-primary' : 'bg-border',
                                        )}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Vertical connector */}
                        {isVertical && !isLast && (
                            <div className="ml-[0.9375rem] h-8 w-0.5 bg-border">
                                <div
                                    className={cn(
                                        'h-full w-full',
                                        state === 'completed' ? 'bg-primary' : 'bg-border',
                                    )}
                                />
                            </div>
                        )}

                        {/* Labels */}
                        <div className={cn(isVertical ? 'pt-1' : 'text-center')}>
                            <p
                                className={cn(
                                    'text-sm font-medium',
                                    state === 'upcoming'
                                        ? 'text-muted-foreground'
                                        : 'text-foreground',
                                )}
                            >
                                {step.label}
                            </p>
                            {step.description && (
                                <p className="text-xs text-muted-foreground">{step.description}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </nav>
    );
}
